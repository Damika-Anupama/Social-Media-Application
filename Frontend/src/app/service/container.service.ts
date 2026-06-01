import {Injectable} from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ContainerService {
    items: string[] = [];

    addToCart(product: string) {
      this.items.push(product);
    }
  
    getItems() {
      return this.items;
    }
  
    clearCart() {
      this.items = [];
      return this.items;
    }
  }