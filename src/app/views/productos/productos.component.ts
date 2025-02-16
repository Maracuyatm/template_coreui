import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { CardComponent, CardHeaderComponent, CardBodyComponent, RowComponent } from '@coreui/angular';
import { ModalToggleDirective, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalBodyComponent, ModalDialogComponent, ModalContentComponent } from '@coreui/angular';
import { ButtonCloseDirective, ButtonModule } from '@coreui/angular';
import { FormModule } from '@coreui/angular';

import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';

import { MasterService } from '../../_service/master.service';
import { Producto } from '../../_model/productos';
import { Categoria } from '../../_model/categorias';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

import { AlertComponent } from '@coreui/angular';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss',
  imports: [
    CommonModule,
    CardComponent, CardHeaderComponent, CardBodyComponent, RowComponent,
    DataTablesModule,
    ModalToggleDirective, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalBodyComponent, ModalDialogComponent, ModalContentComponent,
    ButtonCloseDirective, ButtonModule,
    FormModule, ReactiveFormsModule,
    AlertComponent
  ]
})
export class ProductosComponent implements OnInit {
  productoForm: FormGroup;
  productoLista: Producto[] = [];
  categoriaLista: Categoria[] = [];
  dtOptions: Config = {};
  id: string;
  dtTrigger: Subject<any> = new Subject<any>();
   // Referencia al modal
   @ViewChild('cerrarModal') cerrarModal!: ElementRef;
   

  constructor(
    private service: MasterService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toastr : ToastrService
  ) {
    this.productoForm = this.fb.group({
      producto: ['', Validators.required],
      categoria: ['', Validators.required],
      ubicacion: ['', Validators.required],
      precio: ['', Validators.required]
    });
    this.id = this.activatedRoute.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.getProductos();
    this.getCategorias();
    this.dtOptions = {
      pagingType: 'full',
      pageLength: 5,
      processing: true
    };
    
  }

  getProductos(): void {
    this.service.getProductos().subscribe({
      next: (data: Producto[]) => {
        console.log('Datos recibidos:', data);
        this.productoLista = data;
        this.dtTrigger.next(null);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  getCategorias(): void {
    this.service.getCategorias().subscribe({
      next: (data: Categoria[]) => {
        console.log('Categorias recibidas:', data);
        this.categoriaLista = data;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }
  // ngAfterViewInit() {
  //   console.log('Modal:', this.productosModal);
  //   console.dir(this.productosModal);  // Esto mostrará todas las propiedades del objeto en la consola
  // }

  //Agregar productos
  agregarProducto(): void {
    const producto: Producto = {
      nombre: this.productoForm.get('producto')?.value,
      categoria: this.productoForm.get('categoria')?.value,
      ubicacion: this.productoForm.get('ubicacion')?.value,
      precio: this.productoForm.get('precio')?.value,
    };

    if (this.id) {
      // Editamos un producto existente
      this.service.updateProducto(this.id, producto).subscribe(
        () => {
          this.toastr.info('El producto fue actualizado correctamente', 'Producto actualizado');
         // this.router.navigate(['/'], { replaceUrl: true });
          this.cerrarModal.nativeElement.click(); // Cierra el modal
        },
        (error) => {
          console.error(error);
          this.productoForm.reset();
        }
      );
    } else {
      // Agregamos un nuevo producto
      this.service.saveProducto(producto).subscribe(
        () => {
          //this.toastr.success('El producto fue registrado correctamente', 'Producto registrado');
         // this.productoForm.reset();
          // this.productosModal.toggle();
          this.cerrarModal.nativeElement.click();
          //this.getProductos();
          // this.router.navigate(['/productos']);
  //         this.location.go(this.location.path()); 
  // window.location.reload(); // Refresca la página
        },
        (error) => {
          console.error(error);
          this.productoForm.reset();
        }
      );
    }
  }
}
