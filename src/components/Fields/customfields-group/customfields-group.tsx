import { Component, Element, Event, EventEmitter, Listen, Method, Prop, State } from '@stencil/core';
import { FieldMetadata, FieldTypes, FieldValue } from '../../../interfaces/interfaces';

@Component({
  tag: 'customfields-group'
})
export class CustomFieldsGroup {

  @Element() el: any;
  @Event() customFieldValueChanged: EventEmitter;
  @Prop() listId: string;
  @Prop() fieldMetadataJson: string;
  @Prop() fieldValuesJson: string;
  @Prop() populateDefaultValues: boolean;
  @State() fieldMetadata: Array<FieldMetadata> = [];
  @State() fieldValues: Array<FieldValue> = [];

  componentWillLoad() {
    
    this.fieldMetadata = (this.fieldMetadataJson)
    ? JSON.parse(this.fieldMetadataJson)
    : [];
    
    this.fieldValues = (this.fieldValuesJson)
    ? JSON.parse(this.fieldValuesJson)
    : [];
  }

  async componentDidLoad() {

    await this.addFieldsFromMetadata(this.fieldMetadata);
  }

  @Method()
  async addFieldsFromMetadata(fieldMetadata: Array<FieldMetadata>) {

    this.fieldMetadata = fieldMetadata;
    let fieldsListEl = this.el.querySelector(`#${this.listId}`);
    fieldsListEl.innerHTML = "";
    
    for (let fieldMeta of fieldMetadata) {

      if (this.populateDefaultValues && fieldMeta.defaultValue) {
        // Emit default field value as if it's being changed
        this.customFieldValueChanged.emit({
          fieldId: fieldMeta.id,
          fieldName: fieldMeta.name,
          value: fieldMeta.defaultValue
        });
      }
      
      var fieldValue = this.fieldValues.find((item) => {
        return item.fieldId === fieldMeta.id;
      });
      
      switch (fieldMeta.type) {
        case FieldTypes.Textbox:
          var txtNode = document.createElement("textbox-field");
          txtNode.setAttribute("field-id", fieldMeta.id);
          txtNode.setAttribute("field-name", fieldMeta.name);
          if (fieldMeta.isRequired) {
            txtNode.setAttribute("is-required", 'true');
          }
          if (this.populateDefaultValues && fieldMeta.defaultValue) {
            txtNode.setAttribute("field-value", fieldMeta.defaultValue);
          }
          else if (fieldValue) {
            txtNode.setAttribute("field-value", fieldValue.value);
          }
          fieldsListEl.appendChild(txtNode);
          break;
        
        case FieldTypes.TextArea:
          var txtAreaNode = document.createElement("textarea-field");
          txtAreaNode.setAttribute("field-id", fieldMeta.id);
          txtAreaNode.setAttribute("field-name", fieldMeta.name);
          if (fieldMeta.isRequired) {
            txtAreaNode.setAttribute("is-required", 'true');
          }
          if (this.populateDefaultValues && fieldMeta.defaultValue) {
            txtAreaNode.setAttribute("field-value", fieldMeta.defaultValue);
          }
          else if (fieldValue) {
            txtAreaNode.setAttribute("field-value", fieldValue.value);
          }
          fieldsListEl.appendChild(txtAreaNode);
          break;

        case FieldTypes.Number:
          var numNode = document.createElement("textbox-field");
          numNode.setAttribute("field-id", fieldMeta.id);
          numNode.setAttribute("field-name", fieldMeta.name);
          if (fieldMeta.isRequired) {
            numNode.setAttribute("is-required", 'true');
          }
          if (this.populateDefaultValues && fieldMeta.defaultValue) {
            numNode.setAttribute("field-value", fieldMeta.defaultValue);
          }
          else if (fieldValue) {
            numNode.setAttribute("field-value", fieldValue.value);
          }
          fieldsListEl.appendChild(numNode);
          break;
        
        case FieldTypes.SingleSelectList:
          var sslNode = document.createElement("selectlist-field");
          sslNode.setAttribute("field-id", fieldMeta.id);
          sslNode.setAttribute("field-name", fieldMeta.name);
          sslNode.setAttribute("field-options", JSON.stringify(fieldMeta.valueOptions));
          if (fieldMeta.isRequired) {
            sslNode.setAttribute("is-required", 'true');
          }
          if (this.populateDefaultValues && fieldMeta.defaultValue) {
            sslNode.setAttribute("field-value", fieldMeta.defaultValue);
          }
          else if (fieldValue) {
            sslNode.setAttribute("field-value", fieldValue.value);
          }
          fieldsListEl.appendChild(sslNode);
          break;

        case FieldTypes.MultiSelectList:
          var mslNode = document.createElement("selectlist-field");
          mslNode.setAttribute("field-id", fieldMeta.id);
          mslNode.setAttribute("field-name", fieldMeta.name);
          mslNode.setAttribute("field-options", JSON.stringify(fieldMeta.valueOptions));
          mslNode.setAttribute("is-multiple", '');
          if (fieldMeta.isRequired) {
            mslNode.setAttribute("is-required", 'true');
          }
          if (this.populateDefaultValues && fieldMeta.defaultValue) {
            mslNode.setAttribute("field-value", JSON.stringify(fieldMeta.defaultValue));
          }
          else if (fieldValue) {
            mslNode.setAttribute("field-value", JSON.stringify(fieldValue.value));
          }
          fieldsListEl.appendChild(mslNode);
          break;

        case FieldTypes.DateSelect:
        case FieldTypes.DateTimeSelect:
        case FieldTypes.CheckboxList:
        case FieldTypes.RadioList:        
        default:
          break;
      }   
    }
  }

  @Listen('ionChange')
  handeFieldChange(event: any) {

    if (event.detail) {

      var fv = this.fieldValues.find((item) => {
        return item.fieldId === event.target.id;
      });

      var newValue = Array.isArray(event.detail.value)
        ? JSON.stringify(event.detail.value)
        : event.detail.value;
      
      if (fv) {
        // Update an existing field value
        fv.value = newValue;
        this.customFieldValueChanged.emit(fv);
      }
      else {

        // Store new field value
        let fMeta = this.fieldMetadata.find((item) => {
          return item.id === event.target.id;
        });

        if (fMeta) {
          
          let newFV: FieldValue = {
            fieldId: event.target.id,
            fieldName: fMeta.name,
            value: newValue
          };

          this.fieldValues.push(newFV);
          this.customFieldValueChanged.emit(newFV);
        }
      }
    }
  }

  render() {
    return (
      <ion-card>
        <ion-card-header>
          Fields
        </ion-card-header>
        <ion-card-content>
          <ion-list id={this.listId}></ion-list>
        </ion-card-content>
      </ion-card>
    );
  }
}