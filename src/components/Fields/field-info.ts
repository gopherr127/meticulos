import { FieldTypes, FieldTypeMetadata } from '../../interfaces/interfaces';

export class FieldTypInfo {

  public fieldTypes: Array<FieldTypeMetadata> = [
    { id: FieldTypes.Textbox, name: "Textbox", supportsValueOptions: false },
    { id: FieldTypes.TextArea, name: "Text Area", supportsValueOptions: false },
    { id: FieldTypes.Number, name: "Number", supportsValueOptions: false },
    { id: FieldTypes.SingleSelectList, name: "Single-Select List", supportsValueOptions: true },
    { id: FieldTypes.MultiSelectList, name: "Multi-Select List", supportsValueOptions: true },
    { id: FieldTypes.DateSelect, name: "Date Select", supportsValueOptions: false },
    { id: FieldTypes.DateTimeSelect, name: "Date/Time Select", supportsValueOptions: false },
    { id: FieldTypes.CheckboxList, name: "Checkbox List", supportsValueOptions: true },
    { id: FieldTypes.RadioList, name: "Radio List", supportsValueOptions: true }
  ]
}