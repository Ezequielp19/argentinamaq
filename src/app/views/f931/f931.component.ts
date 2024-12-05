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
  IonSelect,
  IonSelectOption,
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
    IonSelect,
    IonSelectOption,
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

    productosSeleccionados: Producto[] = []; // Aquí almacenaremos los productos seleccionados para comparar.
  maxComparar: number = 3;

  productos: Producto[] = [];

  constructor(
    private firestoreService: FirestoreService,
    private cartService: CartService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.cargarProductos();


   // Cargar las categorías al inicio
    this.categorias = await this.firestoreService.getCategorias();

    // Cargar los productos de la categoría seleccionada, o todos los productos si no hay categoría seleccionada
    if (this.categoriaSeleccionada) {
      await this.cargarProductosPorCategoria(this.categoriaSeleccionada);
    } else {
      await this.cargarProductos(); // Cargar todos los productos
    }

  }

  verPdf(url: string) {
    window.open(url, '_blank');
  }

  async cargarProductos() {
    this.productos = await this.firestoreService.getProductos();
    console.log('productos', this.productos )
    this.paginatedProductos = this.getProductosPaginados();

  }

  paginatedProductos: Producto[] = [];
  currentPage: number = 1;
  pageSize: number = 8;

  // getProductosPaginados(): Producto[] {
  //   const startIndex = (this.currentPage - 1) * this.pageSize;
  //   return this.productos.slice(startIndex, startIndex + this.pageSize);
  // }

  getProductosPaginados(): Producto[] {
    const productosAMostrar = this.categoriaSeleccionada ? this.productosPorCategoria : this.productos;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return productosAMostrar.slice(startIndex, startIndex + this.pageSize);
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

  showDetails(product: any) {
    this.selectedProduct = product;
  }

  hideDetails() {
    this.selectedProduct = null;
  }






compareProduct(product: Producto) {
  // Verificar si el producto ya ha sido agregado
  const productExists = this.productosSeleccionados.some(p => p.id === product.id);

  if (!productExists) {
    // Si no ha sido agregado, lo agregamos al array de comparación
    if (this.productosSeleccionados.length < this.maxComparar) {
      this.productosSeleccionados.push(product);
    } else {
      // Mostrar alerta si se ha alcanzado el límite de productos para comparar
    }
  } else {
  }
}


productosPorCategoria: Producto[] = []; // Productos filtrados por categoría

  categorias: any[] = []; // Lista de categorías para el filtro

  categoriaSeleccionada: string = ''; // Almacena la categoría seleccionada


 // Aquí obtienes el nombre de la categoría seleccionada
  getCategoriaNombre(categoriaId: string): string {
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nombre : 'Categoría no seleccionada';
  }

  // Función para cargar productos por categoría
  async cargarProductosPorCategoria(categoriaId: string) {
    this.productosPorCategoria = await this.firestoreService.getProductosByCategoria(categoriaId);
    console.log('productos por categoria', this.productosPorCategoria);
    this.paginatedProductos = this.getProductosPaginados();
  }

  // Función para manejar el cambio de categoría
  onCategoriaChange(event: any) {
    this.categoriaSeleccionada = event.target.value;
    if (this.categoriaSeleccionada) {
      this.cargarProductosPorCategoria(this.categoriaSeleccionada);
    } else {
      this.cargarProductos(); // Si no hay categoría seleccionada, cargar todos los productos
    }
  }

}
