import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonFab,
  IonFabList,
  IonFabButton,
  IonFooter,
  IonSegment,
  IonCardHeader,
  IonThumbnail,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
  IonSegmentButton,
  IonChip,
  IonAvatar,
  IonSearchbar,
  IonApp,
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
  IonSelect,
  IonSelectOption,

} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../common/modules/ionicons.module';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { UserI } from '../common/models/users.models';
import { CommonModule } from '@angular/common';
import { Producto } from '../common/models/producto.model';
import { Observable } from 'rxjs';
import { AuthService } from '../common/services/auth.service';
import { Marca } from '../common/models/marca.model';
import { Productoferta } from '../common/models/productofree.model';
import { Categoria } from 'src/app/common/models/categoria.model';

type DropdownSegment = 'categoria' | 'marcas' | 'productos' | 'perfil';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonBackButton,
    IonRow,
    IonCol,
    IonFabButton,
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
    IonFab,
    IonSpinner,
    IonInput,
    IonCard,
    FormsModule,
    IoniconsModule,
    CommonModule,
    IonChip,
    IonAvatar,
    IonFabList,
    IonThumbnail,
    IonFooter,
    IonCardHeader,
    IonApp,
    IonCardSubtitle,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonCardTitle,
    IonCardContent,
    IonSelect,
    IonSelectOption,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  producto: Producto | undefined;
  productOferta: Productoferta[] = [];
  categorias: Categoria[] = []; // Agregada para manejar las categorías
  selectedCategoriaId: string | undefined;

  showMasInfo = false;
  user$: Observable<any | null> = this.authService.user$;
  selectedProduct: any;
  marcas: Marca[] = [];
  isSearching: boolean = false; // Nueva variable de estado
  selectedSegment: string;
  isDropdownOpen: Record<string, boolean> = {
    categoria: false,
    marcas: false,
    productos: false,
    perfil: false,
  };

  constructor(
    private router: Router,
    private firestoreService: FirestoreService,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.cargarProductos();

    this.marcas = await this.firestoreService.getMarcas();
    this.cargarProductosOferta();
    this.clearSearch();
    await this.loadCategories(); // Cargar categorías


  }




  async loadCategories() {
    try {
      this.categorias = await this.firestoreService.getCategorias();
      console.log('Categorías:', this.categorias);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  }

  onCategoriaClick(categoriaId: string) {
    this.router.navigate(['/certificacion', { categoriaId: categoriaId }]);
  }

  toggleDropdown(menu: string) {
    this.isDropdownOpen[menu] = !this.isDropdownOpen[menu];
    if (this.isDropdownOpen[menu]) {
      // Cerrar otros dropdowns si uno está abierto
      for (let key in this.isDropdownOpen) {
        if (key !== menu) {
          this.isDropdownOpen[key] = false;
        }
      }
    }
  }

  navigateToCategoria(categoriaId: string) {
    this.router.navigate(['/productos-categoria', categoriaId]);
  }

  // Método para mostrar los detalles del producto al pasar el mouse
  showDetails(product: any) {
    this.selectedProduct = product;
  }

  // Método para ocultar los detalles del producto al quitar el mouse
  hideDetails() {
    this.selectedProduct = null;
  }

  openWhatsApp() {
    const whatsappNumber = '5493417532800';
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;
    window.open(whatsappUrl, '_blank');
  }

  openInstgram() {
    const instagramUrl = 'https://www.instagram.com/ateneasoft1/';
    window.open(instagramUrl, '_blank');
  }

  comprar() {
    const message = `Hola, estoy interesado en el producto ${this.producto?.nombre}`;
    const whatsappUrl = `https://wa.me/5491167554362?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, '_blank');
  }

  logout() {
    this.authService.logout();
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Se ha cerrado la sesión',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  navigateToCertificacion() {
    this.router.navigate(['/certificacion']);
  }

  navigateToFacturacion() {
    this.router.navigate(['/facturacion']);
  }

  navigateToPlanPago() {
    this.router.navigate(['/planpago']);
  }

  navigateToReciboSueldo() {
    this.router.navigate(['/recibosueldo']);
  }

  navigateToPerfil() {
    this.router.navigate(['/perfil']);
  }

  navigateToAfip() {
    this.router.navigate(['/afip']);
  }

  navigateToF931() {
    this.router.navigate(['/F931']);
  }

  navigateToDeclaracion() {
    this.router.navigate(['/declaracion']);
  }

  navigateToDetail(product: Producto) {
    this.router.navigate(['/product', product.id]);
  }

  navigateToDetailOferta(productOfer: Productoferta) {
    this.router.navigate(['/productOferta', productOfer.id]);
  }

  onMarcaClick(marcaId: string) {
    this.router.navigate(['/productos-marca', marcaId]);
  }

  closeSearchResults() {
    this.productosFiltrados = [];
  }

  async cargarProductos() {
    this.productos = await this.firestoreService.getProductos();
    this.productosFiltrados = [];
      console.log('Productos obtenidos de oferta:', this.productos);

  }

  async  cargarProductosOferta() {
    this.productOferta = await this.firestoreService.getProductofertas();
    console.log('Productos obtenidos de oferta:', this.productOferta);
  }

  search(event: any) {
    const query = event.target.value.toLowerCase();
    if (query.trim() === '') {
      this.productosFiltrados = [];
      this.isSearching = false;
    } else {
      this.productosFiltrados = this.productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(query)
      );
      this.isSearching = true;
    }
  }

  clearSearch() {
    const searchbar = document.querySelector('ion-searchbar');
    if (searchbar) {
      searchbar.value = '';
    }
  }

  navigateToProduct(product: Producto) {
    console.log('Navegar a producto:', product);
  }

  navigateTologin() {
    this.router.navigate(['/login']);
  }

  async mostrarAlertaBienvenida(nombre: string) {
    const alert = await this.alertController.create({
      header: '¡Bienvenidx!',
      message: `Hola, ${nombre}!`,
      buttons: ['OK'],
    });
    await alert.present();
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }

  goToCart() {
    this.router.navigate(['/carrito']);
  }


//  slideOpts = {
//     initialSlide: 0,
//     speed: 400,
//     spaceBetween: 10,
//   };


slideOpts = {
  initialSlide: 0,
  slidesPerView: 1, // Muestra una fila de tarjetas
  spaceBetween: 10, // Ajusta el espacio entre las tarjetas
};









}
