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
//import { AppToastComponent } from '../notifications/toasters/toast-simple/toast.component';
import { Rol } from '../../core/models/rol';
import { RolService } from '../../core/services/rol.service';

@Component({
  selector: 'app-roles',
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
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {

  //Inicio tabla
  isDataLoaded: boolean = false; 
  rolLista: Rol[]=[];
  dtOptions: Config = {};
  id: string;
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  //Fin tabla

  constructor(
    private service: RolService, 
    private activatedRoute: ActivatedRoute,
  ) 
  { 
    this.id = this.activatedRoute.snapshot.paramMap.get('id')!;
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
              data: data
            });
          });
        },
        columns: [
          { title: 'Nombre', data: 'nombre' },
          { title: 'Descripción', data: 'descripcion' },
          { title: 'Estado', data: 'estado' },
          { title: 'Fecha de Creación', data: 'fechaCreacion' },
          { title: 'Acciones', data: null }
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
        
          // $(row).find('.edit-btn').on('click', () => {
          //   this.abrirModalEdicion(data)
          // });
          
        
          // $(row).find('.delete-btn').on('click', () => {
          // //this.deleteCategoria(data._id);
          // this.abrirModalEliminar(data._id);
          // });
        
          return row;
        }
        
      };
    }

    getRoles(): void {
        this.service.getRoles().subscribe({
          next: (data: Rol[]) => {
            this.rolLista = data;
            this.isDataLoaded = true;
            this.dtTrigger.next(null);  // Renderiza la tabla
          },
          error: (err) => console.error('Error al cargar roles:', err)
        });
      }

}
