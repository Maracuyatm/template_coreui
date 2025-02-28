import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
  viewChild,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ButtonModule, FormModule } from '@coreui/angular';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ModalBodyComponent,
  ModalComponent,
  ModalContentComponent,
  ModalDialogComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalToggleDirective,
  ButtonCloseDirective,
} from '@coreui/angular';
import {
  ToasterComponent,
  ToastModule,
  ToasterPlacement,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { AppToastComponent } from '../../views/notifications/toasters/toast-simple/toast.component';
import { Rol } from '../../core/models/rol';
import { RolService } from '../../core/services/rol.service';

@Component({
  selector: 'app-rol',
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
    ToasterComponent,
  ],
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.scss',
})
export class RolComponent {
  
  //Inicio tabla
  isDataLoaded: boolean = false;
  rolLista: Rol[] = [];
  dtOptions: Config = {};
  id: string;
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  //Fin tabla

  //Modal y notificación
  visibleModal = false;
  visibleModalEliminar = false;
  rolForm: FormGroup;
  placement = ToasterPlacement.TopEnd;
  visibleToast = false;
  percentage = 0;

  @ViewChildren(ToasterComponent) viewChildren!: QueryList<ToasterComponent>;
  @ViewChild('cerrarModal') cerrarModal!: ElementRef;
  @ViewChild('rolModal') rolModal!: ElementRef;
  @ViewChild('modalBtnAgregar', { static: false }) modalBtnAgregar!: ElementRef;
  @ViewChild('modalBtnEliminar', { static: false })modalBtnEliminar!: ElementRef;
  @ViewChild('modalTitulo', { static: false }) modalTitulo!: ElementRef;
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  //Fin modal y notificación

  constructor(
    private service: RolService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.rolForm = this.fb.group({
      rol: ['', Validators.required],
      descripcion: ['', Validators.required],
      estado: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getRoles();
    this.dtOptions = {
      pagingType: 'full',
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.service.getRoles().subscribe((data: Rol[]) => {
          callback({
            recordsTotal: data.length,
            recordsFiltered: data.length,
            data: data,
          });
        });
      },
      columns: [
        { title: 'Nombre', data: 'nombre' },
        { title: 'Descripción', data: 'descripcion' },
        {
          title: 'Estado',
          data: 'estado',
          render: function (data, type, row) {
            return data
              ? '<span class="badge bg-success">Activo</span>'
              : '<span class="badge bg-danger">Inactivo</span>';
          },
        },
        { title: 'Fecha de Creación', data: 'fechaCreacion' },
        { title: 'Acciones', data: null },
      ],
      rowCallback: (row: Node, data: any, index: number) => {
        const self = this;

        $('td:eq(4)', row).html(`
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
        this.abrirModalEliminar(data._id);
        });

        return row;
      },
    };
  }

  recargarTabla(): void {
    const table = $('#rolTable').DataTable();
    this.service.getRoles().subscribe({
      next: (data: Rol[]) => {
        table.clear();
        table.rows.add(data);
        table.draw();
      },
      error: (err) => console.error('Error al recargar datos:', err),
    });
  }

  //Modales
  abrirModalEdicion(rol: Rol): void {
    this.visibleModal = !this.visibleModal;
    this.modalBtnAgregar.nativeElement.textContent = 'Actualizar rol';
    this.modalTitulo.nativeElement.textContent = 'Editar rol';
    this.id = rol._id!;
    this.rolForm.patchValue({
      rol: rol.nombre,
      descripcion: rol.descripcion,
      estado: rol.estado,
    });
  }

  abrirModalNuevo(): void {
    // Restablece título y formulario
    this.modalTitulo.nativeElement.textContent = 'Nuevo rol';
    this.modalBtnAgregar.nativeElement.textContent = 'Agregar rol';
    this.id = null!;
    this.rolForm.reset();
  }

  abrirModalEliminar(id: string) {
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

  //Crud
  getRoles(): void {
    this.service.getRoles().subscribe({
      next: (data: Rol[]) => {
        this.rolLista = data;
        this.isDataLoaded = true;
        this.dtTrigger.next(null); // Renderiza la tabla
      },
      error: (err) => console.error('Error al cargar roles:', err),
    });
  }

  saveRol(): void {
      const rol: Rol = {
        nombre: this.rolForm.get('rol')?.value,
        descripcion: this.rolForm.get('descripcion')?.value,
        estado: this.rolForm.get('estado')?.value === 'true' || this.rolForm.get('estado')?.value === true
        
        

      };
  
      if (this.id) {
        // Editamos una categoría existente
        this.service.updateRol(this.id, rol).subscribe(
          () => {
            //this.router.navigate(['/'], { replaceUrl: true });
            this.cerrarModal.nativeElement.click(); // Cierra el modal
            this.addToast('Rol actualizado', 'El rol fue actualizado correctamente.', 'info');
           // this.addToast('Error', 'No se pudo eliminar la categoría.', 'danger');
  
            
            this.recargarTabla();
            
            
          },
          (error) => {
            console.error(error);
            this.rolForm.reset();
          }
        );
        
      } else {
        // Agregamos una nueva categoría
        this.service.saveRol(rol).subscribe(
          () => {
            this.cerrarModal.nativeElement.click(); // Cierra el modal
            this.addToast('Rol registrado', 'El rol fue registrado correctamente.', 'success');
            this.recargarTabla();
          },
          (error) => {
            console.error(error);
            this.rolForm.reset();
          }
        );
      }
  
      
    }

    deleteRol(id: string | null) {
    
    
      if (!id) return; // Si el id es null, no hace nada
    
      this.service.deleteRol(id).subscribe(() => {
        this.visibleModalEliminar = false; // Cierra el modal
        this.addToast('Rol eliminado', 'El rol fue eliminado correctamente.', 'success');
        this.recargarTabla(); // Recarga la tabla sin recargar la página
      });
    }



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
}
