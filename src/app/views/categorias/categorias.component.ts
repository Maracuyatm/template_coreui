import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChild, ViewChildren, viewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ButtonModule, FormModule } from '@coreui/angular';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ModalBodyComponent, ModalComponent, ModalContentComponent, ModalDialogComponent, ModalFooterComponent, ModalHeaderComponent, ModalToggleDirective, ButtonCloseDirective } from '@coreui/angular';
import { ToasterComponent, ToastModule, ToasterPlacement  } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { AppToastComponent } from '../notifications/toasters/toast-simple/toast.component';
import { Categoria } from '../../core/models/categoria';
import { MasterService } from '../../core/services/master.service';

@Component({
  selector: 'app-categorias',
  imports: [
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
  visibleModal = false;
  visibleModalEliminar = false;
  

  categoriaForm: FormGroup;
  
  placement = ToasterPlacement.TopEnd;
  categoriaLista: Categoria[]=[];
  dtOptions: Config = {};
  id: string;
  dtTrigger: Subject<any> = new Subject<any>();

  //position = 'top-end';
  visibleToast = false;
  percentage = 0;

  @ViewChildren(ToasterComponent) viewChildren!: QueryList<ToasterComponent>;
  @ViewChild('cerrarModal') cerrarModal!: ElementRef;
  @ViewChild('categoriasModal') categoriasModal!: ElementRef;
  @ViewChild('modalBtnAgregar', { static: false }) modalBtnAgregar!: ElementRef;
  @ViewChild('modalBtnEliminar', { static: false }) modalBtnEliminar!: ElementRef;
  @ViewChild('modalTitulo', { static: false }) modalTitulo!: ElementRef;
 
 // @ViewChild('toaster') toaster!: ToasterComponent;
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

 


  constructor(
    private service: MasterService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toastr: ToastModule,
    
  ){
    this.categoriaForm = this.fb.group({
      categoria: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
    this.id = this.activatedRoute.snapshot.paramMap.get('id')!;
  }


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
          this.abrirModalEdicion(data)
        });
        
      
        $(row).find('.delete-btn').on('click', () => {
        //this.deleteCategoria(data._id);
        this.abrirModalEliminar(data._id);
        });
      
        return row;
      }
      
    };
  }

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


 //Modales
  abrirModalEdicion(categoria: Categoria): void {
    this.visibleModal = !this.visibleModal;
    // Cambia el título del modal
    this.modalBtnAgregar.nativeElement.textContent = 'Actualizar categoría';
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
    this.modalBtnAgregar.nativeElement.textContent = 'Agregar categoría';
    this.id = null!;
    this.categoriaForm.reset();
  }

  abrirModalEliminar(id : string){
    this.id = id;
    this.visibleModalEliminar = !this.visibleModalEliminar;
  }

  handleModal(event: any) {
    this.visibleModal = event;
  }

  handleModalEliminar(event: any) {
    this.visibleModalEliminar = event;
  }
//Fin modales

//Toast
  
  toggleToast() {
    this.visibleToast = !this.visibleToast;
  }

  onVisibleChange($event: boolean) {
    this.visibleToast = $event;
    this.percentage = !this.visibleToast ? 0 : this.percentage;
  }

  onTimerChange($event: number) {
    this.percentage = $event * 25;
  }

  // Fin toast



  

  
  //Crud categoría
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
          this.addToast('Categoría actualizada', 'La categoría fue actualizada correctamente.', 'info');
         // this.addToast('Error', 'No se pudo eliminar la categoría.', 'danger');

          
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
          this.addToast('Categoría registrada', 'La categoría fue registrada correctamente.', 'success');
          this.recargarTabla();
        },
        (error) => {
          console.error(error);
          this.categoriaForm.reset();
        }
      );
    }

    
  }

  
  deleteCategoria(id: string | null) {
    
    
    if (!id) return; // Si el id es null, no hace nada
  
    this.service.deleteCategoria(id).subscribe(() => {
      this.visibleModalEliminar = false; // Cierra el modal
      this.addToast('Categoría eliminada', 'La categoría fue eliminada correctamente.', 'success');
      this.recargarTabla(); // Recarga la tabla sin recargar la página
    });
  }

  //Fin crud

  ////Pruebas

  addToast(title: string, message: string, color: string) {
    const options = {
      title: title,
      message: message,
      delay: 5000,
      placement:this.placement,
      color: color,
      autohide: true,
    };
    const componentRef = this.toaster.addToast(AppToastComponent, { ...options });
  }
  //Fin pruebas
  
  
}
