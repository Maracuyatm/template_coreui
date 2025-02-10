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
import { Categoria } from '../../_model/categorias';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { AlertComponent } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';







@Component({
  selector: 'app-categorias',
  imports: [
    CommonModule,
    CardComponent, CardHeaderComponent, CardBodyComponent,
    DataTablesModule,
    ModalToggleDirective, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalBodyComponent,
    ButtonCloseDirective, ButtonModule,
    FormModule, ReactiveFormsModule,
    AlertComponent, IconModule
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent {

  categoriaForm: FormGroup;
  categoriaLista: Categoria[]=[];
  dtOptions: Config = {};
  id: string;
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild('cerrarModal') cerrarModal!: ElementRef;

  constructor(
    private service: MasterService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
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
      processing: true
    };

  }

  getCategorias(): void {
    this.service.getCategorias().subscribe({
      next: (data: Categoria[]) => {
        console.log('Categorias recibidas:', data);
        this.categoriaLista = data;
        this.dtTrigger.next(null);  // Esto asegura que DataTables cargue correctamente los datos
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }
  

  //Agregar categorias
  agregarcategoria(): void {
    const categoria: Categoria = {
      nombre: this.categoriaForm.get('categoria')?.value,
      descripcion: this.categoriaForm.get('descripcion')?.value,
    };

    if (this.id) {
      // Editamos un categoria existente
      // this.service.updatecategoria(this.id, categoria).subscribe(
      //   () => {
      //    // this.toastr.info('El categoria fue actualizado correctamente', 'categoria actualizado');
      //     this.router.navigate(['/'], { replaceUrl: true });
      //   },
      //   (error) => {
      //     console.error(error);
      //     this.categoriaForm.reset();
      //   }
      // );
    } else {
      // Agregamos un nuevo categoria
      this.service.saveCategoria(categoria).subscribe(
        () => {
          //this.toastr.success('El categoria fue registrado correctamente', 'categoria registrado');
         // this.categoriaForm.reset();
          // this.categoriasModal.toggle();
          this.cerrarModal.nativeElement.click();
          //this.getcategorias();
          // this.router.navigate(['/categorias']);
  //         this.location.go(this.location.path()); 
  // window.location.reload(); // Refresca la página
        },
        (error) => {
          console.error(error);
          this.categoriaForm.reset();
        }
      );
    }
  }
  

}
