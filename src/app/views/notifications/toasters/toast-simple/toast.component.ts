

import { ProgressComponent, ToastBodyComponent, ToastCloseDirective, ToastComponent, ToastHeaderComponent, ToasterService } from '@coreui/angular';

import { ChangeDetectorRef, Component, ElementRef, forwardRef, Input, Renderer2 } from '@angular/core';




@Component({
  selector: 'app-toast-simple',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  providers: [{ provide: ToastComponent, useExisting: forwardRef(() => AppToastComponent) }],
  imports: [ToastHeaderComponent, ToastBodyComponent, ToastCloseDirective, ProgressComponent]
})
export class AppToastComponent extends ToastComponent {

  // constructor() {
  //   super();
  // }

  

  @Input() closeButton = true;
  @Input() title = '';
   @Input() message: string = '';

  constructor(
    public override hostElement: ElementRef,
    public override renderer: Renderer2,
    public override toasterService: ToasterService,
    public override changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }
}
