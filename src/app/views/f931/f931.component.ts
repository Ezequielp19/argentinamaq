import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonList,
  IonItem,
  IonCard,
  IonInput,
  IonSpinner,
  IonButtons,
  IonButton,
  IonIcon,
  IonImg,
  IonCol,
  IonRow,
  IonBackButton,
  IonGrid,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../common/modules/ionicons.module';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import * as bcrypt from 'bcryptjs';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Producto } from 'src/app/common/models/producto.model';
import { CartService } from 'src/app/common/services/cart.service';

@Component({
  selector: 'app-f931',
  templateUrl: './f931.component.html',
  styleUrls: ['./f931.component.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonBackButton,
    IonRow,
    IonCol,
    IonImg,
    IonList,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    IonButtons,
    IonSpinner,
    IonInput,
    IonCard,
    FormsModule,
    IoniconsModule,
    ReactiveFormsModule,
    CommonModule,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    PdfViewerModule,
    IonBadge,
    IoniconsModule
  ],
})
export class F931Component implements OnInit {
  userId: string;
  f931: any;
  pdfs: any[];

  productos: Producto[] = [];

  constructor(
    private firestoreService: FirestoreService,
    private cartService: CartService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.cargarProductos();
  }

  verPdf(url: string) {
    window.open(url, '_blank');
  }

  async cargarProductos() {
    this.productos = await this.firestoreService.getProductos();
    this.paginatedProductos = this.getProductosPaginados();

  }

  paginatedProductos: Producto[] = [];
  currentPage: number = 1;
  pageSize: number = 8;

  getProductosPaginados(): Producto[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.productos.slice(startIndex, startIndex + this.pageSize);
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginatedProductos = this.getProductosPaginados();
    }
  }

  goToNextPage() {
    const totalPages = Math.ceil(this.productos.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.paginatedProductos = this.getProductosPaginados();
    }
  }

navigateToDetail(product:Producto){
  this.router.navigate(['/product', product.id]);
}

selectedProduct: any;

// Método para mostrar los detalles del producto al pasar el mouse
  showDetails(product: any) {
    this.selectedProduct = product;
  }

  // Método para ocultar los detalles del producto al quitar el mouse
  hideDetails() {
    this.selectedProduct = null;
  }


  //  addToCart(product: Producto) {
  //   this.cartService.addToCart(product);
  // }

  async addToCart(product: Producto) {
    this.cartService.addToCart(product);
    await this.showAlert(product.nombre);
  }

  async showAlert(productName: string) {
    const alert = await this.alertController.create({
      header: 'Producto Agregado',
      message: `${productName} ha sido agregado al carrito.`,
      buttons: ['OK'],
    });

    await alert.present();
  }

  goToCart() {
    this.router.navigate(['/carrito']);
  }
}
