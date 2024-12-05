import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonCardTitle,IonCardContent, IonTitle, IonContent, IonLabel, IonList, IonItem, IonCard, IonInput, IonSpinner, IonButtons, IonButton, IonIcon, IonImg, IonCol, IonRow, IonBackButton, IonGrid,IonCardHeader  } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../common/modules/ionicons.module';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import * as bcrypt from 'bcryptjs';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

import { Productoferta } from '../../common/models/productofree.model'; // Importa el modelo de Productoferta




@Component({
  selector: 'app-declaracion',
  templateUrl: './declaracion.component.html',
  styleUrls: ['./declaracion.component.scss'],
 standalone: true,
  imports: [IonGrid, IonBackButton, IonRow, IonCol, IonImg, IonList, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput,
    IonIcon, IonButton, IonButtons, IonSpinner, IonInput, IonCard,
    FormsModule,
    IoniconsModule,
    ReactiveFormsModule,
    CommonModule,
     IonCardHeader,
     IonCardTitle,
     IonCardContent
  ],
})
export class DeclaracionComponent  implements OnInit {
 ofertas: Productoferta[] = [];
  categoriaSeleccionada: string = '';
  categorias: any[] = [];  // Aquí cargarás las categorías si es necesario
  productosSeleccionados: Productoferta[] = []; // Array de productos seleccionados para comparar
  currentPage: number = 1;
  pageSize: number = 8;

   constructor(
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.cargarOfertas();
    // Cargar categorías si es necesario
    // this.categorias = await this.firestoreService.getCategorias();
  }

  async cargarOfertas() {
    this.ofertas = await this.firestoreService.getProductofertas();
    console.log('ofertas', this.ofertas);
  }

  getProductosPaginados(): Productoferta[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.ofertas.slice(startIndex, startIndex + this.pageSize);
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage() {
    const totalPages = Math.ceil(this.ofertas.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }

  

  compareProduct(oferta: Productoferta) {
    // Lógica para agregar a comparación
    if (!this.productosSeleccionados.some(p => p.id === oferta.id)) {
      this.productosSeleccionados.push(oferta);
    }
  }

}
