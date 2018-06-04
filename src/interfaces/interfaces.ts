export interface DashboardPanel {
  id: string,
  title: string,
  typeId: string,
  jsonQueryDocument: string
}

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
  id: string,
  name: string,
  supportsValueOptions: boolean
}

//TODO: export const enum FieldTypes
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
  workflowNodeId: string,
  workflowNode: WorkflowNode,
  fieldValues: Array<FieldValue>,
  linkedItemIds: Array<string>,
  linkedItems: Array<Item>,
  locationId: string,
  location: ItemLocation,
  transitions: Array<WorkflowTransition>,
  images: Array<ItemImage>
}

export interface ItemImage {
  targetItemId: string,
  fileName: string,
  url: string,
  imageData: string,
  fileMetadata: string
}

export interface ItemLocation {
  id: string,
  name: string,
  parentId: string,
  parent: ItemLocation,
  gps: GpsLocation
}

export interface ItemType {
  id: string,
  name: string,
  pluralName: string,
  workflowId: string,
  iconUrl: string,
  isForPhysicalItems: boolean,
  allowNestedItems: boolean,
  createScreenId: string,
  editScreenId: string,
  viewScreenId: string
}

export interface Screen {
  id: string,
  name: string,
  fields: Array<FieldMetadata>,
  displayLocation: boolean,
  displayLinkedItems: boolean,
  displayChildItems: boolean,
  displayImageCapture: boolean,
  displayAttachments: boolean
}

export interface User {
  id: string,
  name: string,
  last_login: string
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
  color: string,
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