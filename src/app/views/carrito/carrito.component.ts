// import { Component, OnInit } from '@angular/core';
// import { CartService } from '../../common/services/cart.service';
// import { CartItem } from '../../common/models/carrito.models';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { IonicModule } from '@ionic/angular';
// import { RouterModule } from '@angular/router';
// import { Producto } from 'src/app/common/models/producto.model';


// @Component({
//   selector: 'app-carrito',
//   templateUrl: './carrito.component.html',
//   styleUrls: ['./carrito.component.scss'],
//  standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     IonicModule,
//     RouterModule
//   ]
// })


// export class CarritoComponent  implements OnInit {
//    cartItems: CartItem[] = [];
//   total: number = 0;


//   constructor(private cartService: CartService) {}

//   ngOnInit(): void {
//     this.cartService.getCart().subscribe(items => {
//       this.cartItems = items;
//       this.total = this.cartService.getTotal();
//     });
//   }


// buy() {
//     // Mensaje inicial del WhatsApp
//     let mensaje = 'Hola, quiero comprar:';

//     // Lista de productos del carrito
//     this.cartItems.forEach(item => {
//       mensaje += `%0A- ${item.producto.nombre} x ${item.cantidad}`;
//     });

//     // Total del carrito
//     const totalMensaje = `%0A%0ATotal: $${this.total.toFixed(2)}`;

//     // Número de WhatsApp al que enviar el mensaje original
//     const whatsappNumber = '5491167554362';



//     // URL completa para abrir WhatsApp con el mensaje
//     const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${mensaje}${totalMensaje}`;

//     // Abrir en una nueva pestaña o ventana del navegador
//     window.open(whatsappUrl, '_blank');
//   }


//    removeFromCart(producto: Producto) {
//     this.cartService.removeFromCart(producto);
//     this.total = this.cartService.getTotal();
//   }

// }


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

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
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
}



//   buy() {
//     let mensaje = 'Hola, quiero comprar:';

//     this.cartItems.forEach(item => {
//       mensaje += `\n- ${item.producto.nombre} x ${item.cantidad}`;
//     });

//     const totalMensaje = `\n\nTotal: $${this.total.toFixed(2)}`;
//     const emailBody = mensaje + totalMensaje;

//     const templateParams = {
//       to_name: 'Destinatario',
//       from_name: 'Tu Nombre',
//       message: emailBody
//     };

//     emailjs.send('service_nvebgs6', 'template_itc7pzm', templateParams, 'HV8KNcQorsxYP088j')
//       .then((response: EmailJSResponseStatus) => {
//         console.log('Correo enviado exitosamente', response.status, response.text);
//       }, (error) => {
//         console.error('Error al enviar el correo:', error);
//       });
//   }

//   removeFromCart(producto: Producto) {
//     this.cartService.removeFromCart(producto);
//     this.total = this.cartService.getTotal();
//   }
// }
