export interface Field {
  id: string,
  name: string,
  type: FieldTypes,
  defaultValue: string,
  valueOptions: Array<FieldOption>
}

export interface FieldChange {
  fieldId: string,
  fieldName: string,
  oldValue: string,
  newValue: string
}

export interface FieldChangeGroup {
  id: string,
  itemId: string,
  changedByUserId: string,
  changedDateTime: Date,
  fieldChanges: Array<FieldChange>
}

export interface FieldMetadata extends Field {
  isRequired: boolean
}

export interface FieldOption {
  id: string,
  fieldId: string,
  name: string
}

export interface FieldTypeMetadata {
  id: number,
  name: string,
  supportsValueOptions: boolean
}

export enum FieldTypes {
  Default,
  Textbox,
  TextArea,
  Number,
  SingleSelectList,
  MultiSelectList,
  DateSelect,
  DateTimeSelect,
  CheckboxList,
  RadioList,
  ImageCapture
}

export interface FieldValue {
  fieldId: string,
  fieldName: string,
  value: string
}

export interface GpsLocation {
  latitude: number,
  longitude: number
}

export interface Icon {
  name: string,
  url: string
}

export interface Item {
  id: string,
  ancestorIds: Array<string>,
  name: string,
  typeId: string,
  type: ItemType,
  parentId: string,
  workflowNode: WorkflowNode,
  fieldValues: Array<FieldValue>,
  location: ItemLocation
}

export interface ItemLocation {
  name: string,
  parentId: string,
  gps: GpsLocation
}

export interface ItemType {
  id: string,
  name: string,
  workflowId: string,
  iconUrl: string,
  isForPlanItems: boolean,
  isForAssets: boolean,
  createScreenId: string,
  editScreenId: string,
  viewScreenId: string
}

export interface Screen {
  id: string,
  name: string,
  fields: Array<FieldMetadata>
}

export interface ValidationResult {
  result: boolean,
  displayMessage: string
}

export interface Workflow {
  id: string,
  name: string,
  nodes: Array<string>,
  transitions: Array<WorkflowTransition>
}

export interface WorkflowNode {
  id: string,
  name: string,
  workflowId: string
}

export interface WorkflowTransition {
  id: string,
  name: string,
  workflowId: string,
  fromNodeId: string,
  fromNode: WorkflowNode,
  toNodeId: string,
  toNode: WorkflowNode,
  screenIds: Array<string>,
  screens: Array<Screen>,
  preConditions: Array<any>,
  validations: Array<any>,
  postFunctions: Array<any>
}