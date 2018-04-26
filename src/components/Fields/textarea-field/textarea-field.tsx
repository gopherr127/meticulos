import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'textarea-field'
})
export class TextareaField {

  @Prop() fieldId: string;
  @Prop() fieldName: string;
  @Prop() fieldValue: string;
  @Prop() isRequired: boolean;
  @Prop() isDisabled: boolean;

  render() {
    return (
      <ion-item>
        { this.isRequired
          ? <ion-label color="primary">{this.fieldName}</ion-label>
          : <ion-label>{this.fieldName}</ion-label>
        }
        <ion-textarea 
          id={this.fieldId} 
          value={this.fieldValue} 
          required={this.isRequired}
          disabled={this.isDisabled}>
        </ion-textarea>
      </ion-item>
    );
  }
}