import { Injectable } from '@angular/core';
import { mockProducts } from '@common/_mocks/mockProducts';
import { CatDur, PluCatDur, PluCats, Product } from '@common/models';
import { BehaviorSubject, map, Observable, of, shareReplay, tap } from 'rxjs';

const products: Product[] = mockProducts;
const DEFAULT_TYPE_ID = 0;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products$: Observable<Product[]>;

  private productState: PluCats[] = [];

  private _productsStateSubj = new BehaviorSubject<PluCats[]>(
    this.productState
  );

  productsState$: Observable<PluCats[]> =
    this._productsStateSubj.asObservable()

  constructor() {
    this.products$ = this.getProducts$().pipe();
  }

  setProductDuration(pluCatDur: PluCatDur) {
    this.changeState(pluCatDur);
  }

  getProducts$(): Observable<Product[]> {
    return of(products).pipe(
      map((products) =>
        products.map((p) => ({
          ...p,
          categories: p.categories.map((c) => ({
            ...c,
            insuranceDetails: c.insuranceDetails.map(
              ({ insurances, type }) => ({
                type: insurances.map((_) => type)[DEFAULT_TYPE_ID],
                insurances: insurances,
              })
            ),
          })),
        }))
      ),

      tap((products) => {
        let pluCats: PluCats[] = products.map(({ plu, categories }) => {
          let catDurs: CatDur[] | any[] = categories.map(
            ({ categoryName, insuranceDetails }) => ({
              categoryName,
              currentDuration: insuranceDetails.map(
                (det) => det.insurances.map((ins) => ins.duration)[0]
              )[0],
            })
          );
          return {
            plu,
            categories: catDurs,
          };
        });
        this.setInitialDurations(pluCats);
      }),
      shareReplay()
    );
  }

  setInitialDurations(pluCats: PluCats[]) {
    pluCats.forEach((pluCat) => {
      pluCat.categories.forEach((category) => {
        let pluCatDur: PluCatDur = {
          plu: pluCat.plu,
          category,
        };
        this.changeState(pluCatDur);
      });
    });
  }

  changeState(change: PluCatDur) {
    // console.log('this.changeState');

    let pluInState = !!this.productState.find(({ plu }) => plu === change.plu);

    if (!pluInState) {
      this.addPluToState(change);
    } else {
      this.updatePluInState(change);
    }
  }

  private addPluToState(change: PluCatDur) {
    let otherPlus = this.productState.filter(({ plu }) => plu !== change.plu);

    let currentChange: PluCats = {
      plu: change.plu,
      categories: [change.category],
    };
    this.productState = [...otherPlus, currentChange];
    this._productsStateSubj.next(this.productState);
  }

  private updatePluInState(change: PluCatDur) {
    let stateForPlu = this.productState.find(({ plu }) => plu === change.plu);

    let stateForPluCategories = stateForPlu?.categories ?? [];
    let pluCategoryNames = stateForPluCategories.map(
      ({ categoryName }) => categoryName
    );
    let stateForPlu_hasCategory = pluCategoryNames?.includes(
      change.category.categoryName
    );

    if (stateForPlu_hasCategory) {
      this.changeDuration(change);
    } else {
      let pluUpdate: PluCats = {
        plu: change.plu,
        categories: [...stateForPluCategories, change.category],
      };
      let otherPlus = this.productState.filter(({ plu }) => plu !== change.plu);
      this.productState = [...otherPlus, pluUpdate];

      this._productsStateSubj.next(this.productState);
    }
  }

  private changeDuration(change: PluCatDur) {
    this.productState = this.productState.map((pluCats: PluCats) => {
      if (pluCats.plu !== change.plu) {
        return pluCats;
      }

      return {
        ...pluCats,
        categories: pluCats.categories.map((catDur: CatDur) => {
          if (catDur.categoryName !== change.category.categoryName) {
            return catDur;
          }

          return {
            ...catDur,
            currentDuration: change.category.currentDuration,
          };
        }),
      };
    });
    // console.log('[changeDuration]')//, this.productState);
    this._productsStateSubj.next(this.productState);
  }
}
