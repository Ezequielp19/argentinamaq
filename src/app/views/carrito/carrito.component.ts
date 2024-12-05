

// carrito.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../common/services/cart.service';
import { CartItem } from '../../common/models/carrito.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { Producto } from 'src/app/common/models/producto.model';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { IoniconsModule } from 'src/app/common/modules/ionicons.module';


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    IoniconsModule
  ]
})
export class CarritoComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;

   from_name: string = '';
  from_email: string = '';

  constructor(private cartService: CartService,private router: Router) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }


 buy() {
    let mensaje = 'Hola, quiero comprar:';

    this.cartItems.forEach(item => {
      mensaje += `\n- ${item.producto.nombre} x Codigo:${item.producto.codigo}  x ${item.cantidad}`;
    });

    const totalMensaje = `\n\nTotal: $${this.total.toFixed(2)}`;
    const emailBody = mensaje + totalMensaje;

    const templateParams = {
      to_name: 'Destinatario',  // Nombre del destinatario en la plantilla de EmailJS
      from_name: this.from_name,  // Nombre del cliente que envía el correo
      from_email: this.from_email,  // Correo electrónico del cliente
      message: emailBody  // Mensaje con detalles del pedido
    };

    emailjs.send('service_xzbmj8w', 'template_3ume5vm', templateParams, 'lbGEaHff6WtlRgiFU')
      .then((response: EmailJSResponseStatus) => {
        console.log('Correo enviado exitosamente', response.status, response.text);
        alert('Tu pedido ha sido enviado. Gracias por tu compra.');
        this.router.navigate(['/']);
      }, (error) => {
        console.error('Error al enviar el correo:', error);
        alert('Hubo un error al enviar tu pedido. Por favor, intenta nuevamente.');
      });
  }

  removeFromCart(producto: Producto) {
    this.cartService.removeFromCart(producto);
    this.total = this.cartService.getTotal();
  }





navigateToMaquinarias() {
  this.router.navigate(['/MAQUINARIAS']);
}

navigateToDiscos() {
  this.router.navigate(['/DISCOS']);
}

}


