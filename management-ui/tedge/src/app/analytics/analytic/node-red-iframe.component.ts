import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { AlertService, ModalService } from '@c8y/ngx-components';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-node-red-iframe',
  templateUrl: './node-red-iframe.component.html'
})
export class NodeRedIframeComponent implements OnDestroy, AfterViewInit {
  hasRequiredRoles = false;
  currentUserSubscription: Subscription;
  private iframeURL: string;

  @ViewChild('iframe') iframe: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private modalService: ModalService
  ) {
    //this.iframeURL = 'http://node-red:1880';
    this.iframeURL = 'http://localhost:1880';
  }

  ngAfterViewInit(): void {
    this.setupIframe();
  }

  ngOnDestroy(): void {
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }

  private async setupIframe() {
    this.setIframeUrl();
  }

  private setIframeUrl() {
    // set iFrame's SRC attribute
    const iframe: HTMLIFrameElement = this.iframe.nativeElement;
    iframe.src = this.iframeURL;
  }
}