import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { ButtonModule, FormModule } from '@coreui/angular';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ModalBodyComponent, ModalComponent, ModalContentComponent, ModalDialogComponent, ModalFooterComponent, ModalHeaderComponent, ModalToggleDirective, ButtonCloseDirective } from '@coreui/angular';
import { AlertComponent, ToasterComponent, ToasterService, ToastModule } from '@coreui/angular';

import { IconModule } from '@coreui/icons-angular';

import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';

import { AppToastComponent } from '../notifications/toasters/toast-simple/toast.component';
import { Categoria } from '../../_model/categorias';
import { MasterService } from '../../_service/master.service';



@Component({
  selector: 'app-categorias',
  imports: [
    AlertComponent, 
    AppToastComponent,
    ButtonCloseDirective, 
    ButtonModule,
    CardBodyComponent, 
    CardComponent, 
    CardHeaderComponent,
    CommonModule,
    DataTablesModule,
    FormModule, 
    IconModule,
    ModalBodyComponent, 
    ModalComponent, 
    ModalFooterComponent, 
    ModalHeaderComponent, 
    ModalToggleDirective,
    ReactiveFormsModule,
    ToastModule, 
    ToasterComponent
],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent {

  isDataLoaded: boolean = false; 
  public visible = false;
  categoriaForm: FormGroup;
  categoriaLista: Categoria[]=[];
  dtOptions: Config = {};
  id: string;
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChildren(ToasterComponent) viewChildren!: QueryList<ToasterComponent>;
  @ViewChild('cerrarModal') cerrarModal!: ElementRef;
  @ViewChild('categoriasModal') categoriasModal!: ElementRef;
  @ViewChild('modalTitulo', { static: false }) modalTitulo!: ElementRef;
  @ViewChild('toaster') toaster!: ToasterComponent;
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;

 


  constructor(
    private service: MasterService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toastr: ToastModule
  ){
    this.categoriaForm = this.fb.group({
      categoria: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
    this.id = this.activatedRoute.snapshot.paramMap.get('id')!;
  }

  // ngOnInit(): void {
  //   this.getCategorias();
  //   this.dtOptions = {
  //     pagingType: 'full',
  //     pageLength: 5,
  //     processing: true
  //   };
  // }
  ngOnInit(): void {
    this.getCategorias();
    this.dtOptions = {
      pagingType: 'full',
      pageLength: 5,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.service.getCategorias().subscribe((data: Categoria[]) => {
          callback({
            recordsTotal: data.length,
            recordsFiltered: data.length,
            data: data
          });
        });
      },
      columns: [
        { title: 'Nombre', data: 'nombre' },
        { title: 'Descripción', data: 'descripcion' },
        { title: 'Fecha de Creación', data: 'fechaCreacion' },
        { title: 'Acciones', data: null }
      ],
      rowCallback: (row: Node, data: any, index: number) => {
        const self = this;
      
        $('td:eq(3)', row).html(`
          <button class="btn btn-sm btn-warning edit-btn me-2">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button class="btn btn-sm btn-danger delete-btn">
            <i class="fas fa-trash-alt"></i>
          </button>
        `);
      
        $(row).find('.edit-btn').on('click', () => {
          console.log("Editar 1");
          this.abrirModalEdicion(data)
          
        });
        
      
        $(row).find('.delete-btn').on('click', () => {
         // self.eliminarCategoria((data as Categoria)._id);  // Convertimos a Categoria
         console.log("Eliminar 1");
         
        });
      
        return row;
      }
      
    };

    
    
    // this.dtOptions = {
    //   pagingType: 'full',
    //   pageLength: 5,
    //   processing: true,
    //   ajax: (dataTablesParameters: any, callback) => {
    //     this.service.getCategorias().subscribe((data: Categoria[]) => {
    //       callback({
    //         recordsTotal: data.length,
    //         recordsFiltered: data.length,
    //         data: data
    //       });
    //     });
    //   },
    //   columns: [
    //     { title: 'Nombre', data: 'nombre' },
    //     { title: 'Descripción', data: 'descripcion' },
    //     { title: 'Fecha de Creación', data: 'fechaCreacion' },
    //     { title: 'Acciones', data: null }  // Esto lo manejas con rowCallback
    //   ]
    // };
  }

 
  abrirModalEdicion(categoria: Categoria): void {
    this.visible = !this.visible;
    // Cambia el título del modal
    this.modalTitulo.nativeElement.textContent = 'Editar categoría';

    
    // Asigna el ID y carga los valores en el formulario
    this.id = categoria._id!;
    this.categoriaForm.patchValue({
      categoria: categoria.nombre,
      descripcion: categoria.descripcion,
    });
  }

  abrirModalNuevo(): void {
    // Restablece título y formulario
    this.modalTitulo.nativeElement.textContent = 'Nueva categoría';
    this.id = null!;
    this.categoriaForm.reset();
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
    this.modalTitulo.nativeElement.textContent = 'Editar categoría';
  }
  handleLiveDemoChange(event: any) {
    this.visible = event;
  }


  
  // getCategorias(): void {
  //   this.service.getCategorias().subscribe({
  //     next: (data: Categoria[]) => {
  //       this.categoriaLista = data;
  //       this.isDataLoaded = true;  // Cambia a true cuando los datos se cargan
  //       this.dtTrigger.next(null);
  //     },
  //     error: (err) => console.error('Error al cargar categorías:', err)
  //   });
  // }
  getCategorias(): void {
    this.service.getCategorias().subscribe({
      next: (data: Categoria[]) => {
        this.categoriaLista = data;
        this.isDataLoaded = true;
        this.dtTrigger.next(null);  // Renderiza la tabla
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  // recargarTabla(): void {
  //   this.service.getCategorias().subscribe((data: Categoria[]) => {
  //     const tabla = $('#miTabla').DataTable(); // Asegúrate de poner el ID correcto de tu tabla
  //     tabla.clear();               // Limpia los datos actuales
  //     tabla.rows.add(data);        // Agrega los nuevos datos
  //     tabla.draw();                // Redibuja la tabla
  //   });
  // }
  recargarTabla(): void {
    const table = $('#categoriasTable').DataTable();
    this.service.getCategorias().subscribe({
      next: (data: Categoria[]) => {
        table.clear();
        table.rows.add(data);
        table.draw();
      },
      error: (err) => console.error('Error al recargar datos:', err)
    });
  }

  
  saveCategoria(): void {
    const categoria: Categoria = {
      nombre: this.categoriaForm.get('categoria')?.value,
      descripcion: this.categoriaForm.get('descripcion')?.value,
    };

    if (this.id) {
      // Editamos una categoría existente
      this.service.updateCategoria(this.id, categoria).subscribe(
        () => {
          //this.router.navigate(['/'], { replaceUrl: true });
          this.cerrarModal.nativeElement.click(); // Cierra el modal
          
          
          this.recargarTabla();
          
          
        },
        (error) => {
          console.error(error);
          this.categoriaForm.reset();
        }
      );
      
    } else {
      // Agregamos una nueva categoría
      this.service.saveCategoria(categoria).subscribe(
        () => {
          this.cerrarModal.nativeElement.click(); // Cierra el modal
          this.recargarTabla();
        },
        (error) => {
          console.error(error);
          this.categoriaForm.reset();
        }
      );
    }

    
  }

  deleteCategoria(id: string) {
    this.service.deleteCategoria(id).subscribe(() => {
     // this.reloadComponent(); // Actualiza la tabla sin recargar toda la página
    });
  }
  
}
