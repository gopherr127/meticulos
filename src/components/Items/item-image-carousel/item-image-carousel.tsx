import { Component, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { ItemImage } from '../../../interfaces/interfaces';

@Component({
  tag: 'item-image-carousel'
})
export class ItemImageCarousel {
  
  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Event() itemImageAdded: EventEmitter;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop() itemImages: string;
  @State() images: Array<ItemImage> = [];
  @State() itemImagesLoaded: boolean = false;
  @State() currentItemImage: ItemImage;
  currentImageIndex: number = 0;
  imageElement: HTMLElement;

  componentWillLoad() {

    this.images = this.itemImages
      ? JSON.parse(this.itemImages)
      : [];
  }

  componentDidLoad() {

    this.imageElement = this.el.querySelector('#imageElement');
  }
  
  async presentImageCapturer() {
    
    const modal = await this.modalCtrl.create({
      component: 'image-capturer'
    });
    
    await modal.present();
  }

  @Listen('body:itemImageCaptured')
  async handleImageCapture(event: any) {

    if (event.detail) {

      let response = await fetch(
        `${this.apiBaseUrl}/itemimages`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(event.detail)
      });
  
      if (response.ok) {
        
        let image = await response.json();
        
        let newImage: ItemImage = event.detail;
        newImage.url = image.url;

        // Add the item image to the item
        this.images = [...this.images, newImage];
        this.itemImageAdded.emit(newImage);
      }
      else {

        console.log(await response.text());
      }
    }
  }

  async loadImage(imageIndex: number) {

    if (this.images) {

      if (imageIndex > this.images.length - 1) {
        imageIndex = 0;
      } else if (imageIndex < 0) {
        imageIndex = this.images.length - 1;
      }
      
      this.currentImageIndex = imageIndex;
      this.currentItemImage = this.images[imageIndex];

      if (!this.currentItemImage.imageData || this.currentItemImage.imageData === '') {

        let response = await fetch(
          `${this.apiBaseUrl}/itemimages?imageFileName=${this.currentItemImage.fileName}`, {
            method: 'GET'
        });

        if (response.ok) {

          this.currentItemImage.imageData = await response.text();
        }
      }
      
      this.imageElement.setAttribute('src', 
        this.currentItemImage.fileMetadata + this.currentItemImage.imageData);
    }

    this.itemImagesLoaded = true;

  }

  render() {
    return (
      <ion-card>
        <ion-card-header no-padding>
            <ion-item>
              <ion-label>
                Images
              </ion-label>
              <ion-button slot="end" color="secondary"
                          onClick={ () => this.presentImageCapturer() }>
                Capture
              </ion-button>
              <ion-button slot="end" color="secondary"
                          onClick={ () => this.loadImage(0) }>
                View Images
              </ion-button>
            </ion-item>
        </ion-card-header>
        <ion-card-content>
          <img id="imageElement"/>
          <ion-item>
            <ion-label>Count: { this.images.length }</ion-label>
          </ion-item>
        </ion-card-content>
        <ion-grid style={{ display: this.itemImagesLoaded ? 'block' : 'none'}}>
          <ion-row>
            <ion-col col-2>
              <ion-button fill="clear" color="secondary"
                          onClick={ () => this.loadImage(this.currentImageIndex-1) }>
                <ion-icon name="arrow-dropleft-circle"></ion-icon>
              </ion-button>
              <span></span>
            </ion-col>  
            <ion-col col-8 align-self-center>
              <span>{ this.currentItemImage ? this.currentItemImage.fileName : '' }</span>
            </ion-col>
            <ion-col col-2>
              <span></span>
              <ion-button fill="clear" color="secondary"
                          onClick={ () => this.loadImage(this.currentImageIndex+1) }>
                <ion-icon name="arrow-dropright-circle"></ion-icon>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-card>
    );
  }
}