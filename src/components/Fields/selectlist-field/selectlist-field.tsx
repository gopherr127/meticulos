import { Component, Prop, State } from '@stencil/core';
import { FieldOption } from '../../../interfaces/interfaces';

@Component({
  tag: 'selectlist-field'
})
export class SelectListField {

  @Prop() fieldId: string;
  @Prop() fieldName: string;
  @Prop() fieldOptions: string;
  @State() fieldValueOptions: Array<FieldOption> = [];
  @Prop() fieldValue: string;
  @State() fieldValues: Array<string>;
  @Prop() isRequired: boolean;
  @Prop() isMultiple: boolean;

  componentWillLoad() {
    
    this.fieldValueOptions = JSON.parse(this.fieldOptions);
    if (this.isMultiple) {
      if (this.fieldValue) {
        this.fieldValues = JSON.parse(this.fieldValue);
      }
      else {
        this.fieldValues = [];
      }
    }
  }

  render() {
    return (
      <ion-item>
        { this.isRequired
          ? <ion-label color="primary">{this.fieldName}</ion-label>
          : <ion-label>{this.fieldName}</ion-label>
        }
        { this.isMultiple
          ? <ion-select 
              id={ this.fieldId } 
              value={ this.fieldValues }
              multiple={ this.isMultiple }>
              { this.fieldValueOptions.map(option =>
                <ion-select-option value={ option.id }>
                  { option.name }
                </ion-select-option>
              )}
            </ion-select>
          : <ion-select 
              id={ this.fieldId } 
              value={ this.fieldValue }>
              { this.fieldValueOptions.map(option =>
                <ion-select-option value={ option.id }>
                  { option.name }
                </ion-select-option>
              )}
            </ion-select>
        }
        
      </ion-item>
    );
  }
}