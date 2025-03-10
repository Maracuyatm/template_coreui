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

import { Usuario } from '../../core/models/usuario';
import { Rol } from '../../core/models/rol';
import { UsuarioService } from '../../core/services/usuario.service';
import { RolService } from '../../core/services/rol.service';

@Component({
  selector: 'app-usuario',
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
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {

  //Inicio tabla
    isDataLoaded: boolean = false;
    usuarioLista: Usuario[] = [];
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
    usuarioForm: FormGroup;
    placement = ToasterPlacement.TopEnd;
    visibleToast = false;
    percentage = 0;
  
    @ViewChildren(ToasterComponent) viewChildren!: QueryList<ToasterComponent>;
    @ViewChild('cerrarModal') cerrarModal!: ElementRef;
    @ViewChild('usuarioModal') usuarioModal!: ElementRef;
    @ViewChild('modalBtnAgregar', { static: false }) modalBtnAgregar!: ElementRef;
    @ViewChild('modalBtnEliminar', { static: false })modalBtnEliminar!: ElementRef;
    @ViewChild('modalTitulo', { static: false }) modalTitulo!: ElementRef;
    @ViewChild(ToasterComponent) toaster!: ToasterComponent;
    //Fin modal y notificación

    constructor(
      private service: UsuarioService,
      private rolService: RolService,
      private activatedRoute: ActivatedRoute,
      private fb: FormBuilder
    ) {
      this.id = this.activatedRoute.snapshot.paramMap.get('id')!;
      this.usuarioForm = this.fb.group({
        usuario: ['', Validators.required],
        clave: ['', Validators.required],
        correo: ['', Validators.required],
        rol: ['', Validators.required],
        estado: [true, Validators.required]
      });
    }

    ngOnInit(): void {
      this.usuarioForm.statusChanges.subscribe(status => {
        console.log('Estado del formulario:', status); // 'VALID' o 'INVALID'
        console.log('Formulario completo:', this.usuarioForm);
      });
      this.getRoles();
      this.getUsuarios();
      this.dtOptions = {
        pagingType: 'full',
        processing: true,
        ajax: (dataTablesParameters: any, callback) => {
          this.service.getUsuarios().subscribe((data: Usuario[]) => {
            callback({
              recordsTotal: data.length,
              recordsFiltered: data.length,
              data: data,
            });
          });
        },
        columns: [
          { title: 'Usuario', data: 'usuario' },
          { title: 'Clave', data: 'clave' },
          { title: 'Rol', data: 'rol' },
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
  
          $('td:eq(5)', row).html(`
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

    getRoles(): void {
      this.rolService.getRoles().subscribe({
        next: (data: Rol[]) => {
          this.rolLista = data;
          this.isDataLoaded = true;
          //this.dtTrigger.next(null); // Renderiza la tabla
        },
        error: (err) => console.error('Error al cargar roles:', err),
      });
    }

    recargarTabla(): void {
        const table = $('#usuarioTable').DataTable();
        this.service.getUsuarios().subscribe({
          next: (data: Usuario[]) => {
            table.clear();
            table.rows.add(data);
            table.draw();
          },
          error: (err) => console.error('Error al recargar datos:', err),
        });
      }

       //Modales
        abrirModalEdicion(usuario: Usuario): void {
          this.visibleModal = !this.visibleModal;
          this.modalBtnAgregar.nativeElement.textContent = 'Actualizar usuario';
          this.modalTitulo.nativeElement.textContent = 'Editar usuario';
          this.id = usuario._id!;
          this.usuarioForm.patchValue({
            usuario: usuario.usuario,
            clave: usuario.clave,
            correo: usuario.correo,
            rol: usuario.rol.nombre,
            estado: usuario.estado,
          });
        }
      
        abrirModalNuevo(): void {
          // Restablece título y formulario
          this.modalTitulo.nativeElement.textContent = 'Nuevo usuario';
          this.modalBtnAgregar.nativeElement.textContent = 'Agregar usuario';
          this.id = null!;
          this.usuarioForm.reset();
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
    getUsuarios(): void {
      this.service.getUsuarios().subscribe({
        next: (data: Usuario[]) => {
          this.usuarioLista = data;
          this.isDataLoaded = true;
          this.dtTrigger.next(null); // Renderiza la tabla
        },
        error: (err) => console.error('Error al cargar usuarios:', err),
      });
    }
  
    saveUsuario(): void {
      const usuario: Usuario = {
        usuario: this.usuarioForm.get('usuario')?.value,
        clave: this.usuarioForm.get('clave')?.value,
        correo: this.usuarioForm.get('correo')?.value,
        // rol: { nombre: this.usuarioForm.get('rol')?.value }, // Si el rol viene como string, lo colocamos en un objeto
        rol: this.usuarioForm.get('rol')?.value,

        estado: this.usuarioForm.get('estado')?.value === 'true' || this.usuarioForm.get('estado')?.value === true
     };
    
        if (this.id) {
          // Editamos una categoría existente
          this.service.updateUsuario(this.id, usuario).subscribe(
            () => {
              //this.router.navigate(['/'], { replaceUrl: true });
              this.cerrarModal.nativeElement.click(); // Cierra el modal
              this.addToast('Usuario actualizado', 'El usuario fue actualizado correctamente.', 'info');
             // this.addToast('Error', 'No se pudo eliminar la categoría.', 'danger');
    
              
              this.recargarTabla();
              
              
            },
            (error) => {
              console.error(error);
              this.usuarioForm.reset();
            }
          );
          
        } else {
          // Agregamos una nueva categoría
          this.service.saveUsuario(usuario).subscribe(
            () => {
              this.cerrarModal.nativeElement.click(); // Cierra el modal
              this.addToast('Usuario registrado', 'El usuario fue registrado correctamente.', 'success');
              this.recargarTabla();
            },
            (error) => {
              console.error(error);
              this.usuarioForm.reset();
            }
          );
        }
    
        
      }
  
      deleteUsuario(id: string | null) {
      
      
        if (!id) return; // Si el id es null, no hace nada
      
        this.service.deleteUsuario(id).subscribe(() => {
          this.visibleModalEliminar = false; // Cierra el modal
          this.addToast('Usuario eliminado', 'El usuario fue eliminado correctamente.', 'success');
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
