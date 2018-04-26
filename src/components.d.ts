/**
 * This is an autogenerated file created by the Stencil build process.
 * It contains typing information for all components that exist in this project
 * and imports for stencil collections that might be configured in your stencil.config.js file
 */

import '@stencil/core';

declare global {
  namespace JSX {
    interface Element {}
    export interface IntrinsicElements {}
  }
  namespace JSXElements {}

  interface HTMLStencilElement extends HTMLElement {
    componentOnReady(): Promise<this>;
    componentOnReady(done: (ele?: this) => void): void;

    forceUpdate(): void;
  }

  interface HTMLAttributes {}
}

import 'ionicons';
import '@ionic/core';


declare global {

  namespace StencilComponents {
    interface FieldCreate {

    }
  }

  interface HTMLFieldCreateElement extends StencilComponents.FieldCreate, HTMLStencilElement {}

  var HTMLFieldCreateElement: {
    prototype: HTMLFieldCreateElement;
    new (): HTMLFieldCreateElement;
  };
  interface HTMLElementTagNameMap {
    'field-create': HTMLFieldCreateElement;
  }
  interface ElementTagNameMap {
    'field-create': HTMLFieldCreateElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'field-create': JSXElements.FieldCreateAttributes;
    }
  }
  namespace JSXElements {
    export interface FieldCreateAttributes extends HTMLAttributes {

    }
  }
}


declare global {

  namespace StencilComponents {
    interface FieldDetail {
      'fieldId': string;
      'returnUrl': string;
    }
  }

  interface HTMLFieldDetailElement extends StencilComponents.FieldDetail, HTMLStencilElement {}

  var HTMLFieldDetailElement: {
    prototype: HTMLFieldDetailElement;
    new (): HTMLFieldDetailElement;
  };
  interface HTMLElementTagNameMap {
    'field-detail': HTMLFieldDetailElement;
  }
  interface ElementTagNameMap {
    'field-detail': HTMLFieldDetailElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'field-detail': JSXElements.FieldDetailAttributes;
    }
  }
  namespace JSXElements {
    export interface FieldDetailAttributes extends HTMLAttributes {
      'fieldId'?: string;
      'returnUrl'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface FieldsList {
      'subtitle': string;
    }
  }

  interface HTMLFieldsListElement extends StencilComponents.FieldsList, HTMLStencilElement {}

  var HTMLFieldsListElement: {
    prototype: HTMLFieldsListElement;
    new (): HTMLFieldsListElement;
  };
  interface HTMLElementTagNameMap {
    'fields-list': HTMLFieldsListElement;
  }
  interface ElementTagNameMap {
    'fields-list': HTMLFieldsListElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'fields-list': JSXElements.FieldsListAttributes;
    }
  }
  namespace JSXElements {
    export interface FieldsListAttributes extends HTMLAttributes {
      'subtitle'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface ItemTypesList {
      'subtitle': string;
    }
  }

  interface HTMLItemTypesListElement extends StencilComponents.ItemTypesList, HTMLStencilElement {}

  var HTMLItemTypesListElement: {
    prototype: HTMLItemTypesListElement;
    new (): HTMLItemTypesListElement;
  };
  interface HTMLElementTagNameMap {
    'item-types-list': HTMLItemTypesListElement;
  }
  interface ElementTagNameMap {
    'item-types-list': HTMLItemTypesListElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'item-types-list': JSXElements.ItemTypesListAttributes;
    }
  }
  namespace JSXElements {
    export interface ItemTypesListAttributes extends HTMLAttributes {
      'subtitle'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface ItemsList {
      'returnUrl': string;
      'subtitle': string;
    }
  }

  interface HTMLItemsListElement extends StencilComponents.ItemsList, HTMLStencilElement {}

  var HTMLItemsListElement: {
    prototype: HTMLItemsListElement;
    new (): HTMLItemsListElement;
  };
  interface HTMLElementTagNameMap {
    'items-list': HTMLItemsListElement;
  }
  interface ElementTagNameMap {
    'items-list': HTMLItemsListElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'items-list': JSXElements.ItemsListAttributes;
    }
  }
  namespace JSXElements {
    export interface ItemsListAttributes extends HTMLAttributes {
      'returnUrl'?: string;
      'subtitle'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface ScreenCreate {

    }
  }

  interface HTMLScreenCreateElement extends StencilComponents.ScreenCreate, HTMLStencilElement {}

  var HTMLScreenCreateElement: {
    prototype: HTMLScreenCreateElement;
    new (): HTMLScreenCreateElement;
  };
  interface HTMLElementTagNameMap {
    'screen-create': HTMLScreenCreateElement;
  }
  interface ElementTagNameMap {
    'screen-create': HTMLScreenCreateElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'screen-create': JSXElements.ScreenCreateAttributes;
    }
  }
  namespace JSXElements {
    export interface ScreenCreateAttributes extends HTMLAttributes {

    }
  }
}


declare global {

  namespace StencilComponents {
    interface ScreenDetail {
      'returnUrl': string;
      'screenId': string;
    }
  }

  interface HTMLScreenDetailElement extends StencilComponents.ScreenDetail, HTMLStencilElement {}

  var HTMLScreenDetailElement: {
    prototype: HTMLScreenDetailElement;
    new (): HTMLScreenDetailElement;
  };
  interface HTMLElementTagNameMap {
    'screen-detail': HTMLScreenDetailElement;
  }
  interface ElementTagNameMap {
    'screen-detail': HTMLScreenDetailElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'screen-detail': JSXElements.ScreenDetailAttributes;
    }
  }
  namespace JSXElements {
    export interface ScreenDetailAttributes extends HTMLAttributes {
      'returnUrl'?: string;
      'screenId'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface ScreensList {
      'subtitle': string;
    }
  }

  interface HTMLScreensListElement extends StencilComponents.ScreensList, HTMLStencilElement {}

  var HTMLScreensListElement: {
    prototype: HTMLScreensListElement;
    new (): HTMLScreensListElement;
  };
  interface HTMLElementTagNameMap {
    'screens-list': HTMLScreensListElement;
  }
  interface ElementTagNameMap {
    'screens-list': HTMLScreensListElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'screens-list': JSXElements.ScreensListAttributes;
    }
  }
  namespace JSXElements {
    export interface ScreensListAttributes extends HTMLAttributes {
      'subtitle'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface FunctionFieldRequired {
      'functionArgs': any;
      'getFunctionArgs': () => string;
    }
  }

  interface HTMLFunctionFieldRequiredElement extends StencilComponents.FunctionFieldRequired, HTMLStencilElement {}

  var HTMLFunctionFieldRequiredElement: {
    prototype: HTMLFunctionFieldRequiredElement;
    new (): HTMLFunctionFieldRequiredElement;
  };
  interface HTMLElementTagNameMap {
    'function-field-required': HTMLFunctionFieldRequiredElement;
  }
  interface ElementTagNameMap {
    'function-field-required': HTMLFunctionFieldRequiredElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'function-field-required': JSXElements.FunctionFieldRequiredAttributes;
    }
  }
  namespace JSXElements {
    export interface FunctionFieldRequiredAttributes extends HTMLAttributes {
      'functionArgs'?: any;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface FunctionMakeApiCall {
      'functionArgs': any;
      'getFunctionArgs': () => string;
    }
  }

  interface HTMLFunctionMakeApiCallElement extends StencilComponents.FunctionMakeApiCall, HTMLStencilElement {}

  var HTMLFunctionMakeApiCallElement: {
    prototype: HTMLFunctionMakeApiCallElement;
    new (): HTMLFunctionMakeApiCallElement;
  };
  interface HTMLElementTagNameMap {
    'function-make-api-call': HTMLFunctionMakeApiCallElement;
  }
  interface ElementTagNameMap {
    'function-make-api-call': HTMLFunctionMakeApiCallElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'function-make-api-call': JSXElements.FunctionMakeApiCallAttributes;
    }
  }
  namespace JSXElements {
    export interface FunctionMakeApiCallAttributes extends HTMLAttributes {
      'functionArgs'?: any;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface FunctionUserInGroup {
      'functionArgs': any;
      'getFunctionArgs': () => string;
    }
  }

  interface HTMLFunctionUserInGroupElement extends StencilComponents.FunctionUserInGroup, HTMLStencilElement {}

  var HTMLFunctionUserInGroupElement: {
    prototype: HTMLFunctionUserInGroupElement;
    new (): HTMLFunctionUserInGroupElement;
  };
  interface HTMLElementTagNameMap {
    'function-user-in-group': HTMLFunctionUserInGroupElement;
  }
  interface ElementTagNameMap {
    'function-user-in-group': HTMLFunctionUserInGroupElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'function-user-in-group': JSXElements.FunctionUserInGroupAttributes;
    }
  }
  namespace JSXElements {
    export interface FunctionUserInGroupAttributes extends HTMLAttributes {
      'functionArgs'?: any;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface FunctionUserInRole {
      'functionArgs': any;
      'getFunctionArgs': () => string;
    }
  }

  interface HTMLFunctionUserInRoleElement extends StencilComponents.FunctionUserInRole, HTMLStencilElement {}

  var HTMLFunctionUserInRoleElement: {
    prototype: HTMLFunctionUserInRoleElement;
    new (): HTMLFunctionUserInRoleElement;
  };
  interface HTMLElementTagNameMap {
    'function-user-in-role': HTMLFunctionUserInRoleElement;
  }
  interface ElementTagNameMap {
    'function-user-in-role': HTMLFunctionUserInRoleElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'function-user-in-role': JSXElements.FunctionUserInRoleAttributes;
    }
  }
  namespace JSXElements {
    export interface FunctionUserInRoleAttributes extends HTMLAttributes {
      'functionArgs'?: any;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface WorkflowNodeCreate {
      'workflowId': string;
    }
  }

  interface HTMLWorkflowNodeCreateElement extends StencilComponents.WorkflowNodeCreate, HTMLStencilElement {}

  var HTMLWorkflowNodeCreateElement: {
    prototype: HTMLWorkflowNodeCreateElement;
    new (): HTMLWorkflowNodeCreateElement;
  };
  interface HTMLElementTagNameMap {
    'workflow-node-create': HTMLWorkflowNodeCreateElement;
  }
  interface ElementTagNameMap {
    'workflow-node-create': HTMLWorkflowNodeCreateElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'workflow-node-create': JSXElements.WorkflowNodeCreateAttributes;
    }
  }
  namespace JSXElements {
    export interface WorkflowNodeCreateAttributes extends HTMLAttributes {
      'workflowId'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface WorkflowTransitionFunctionCreate {
      'functionTypeId': number;
      'transitionId': string;
    }
  }

  interface HTMLWorkflowTransitionFunctionCreateElement extends StencilComponents.WorkflowTransitionFunctionCreate, HTMLStencilElement {}

  var HTMLWorkflowTransitionFunctionCreateElement: {
    prototype: HTMLWorkflowTransitionFunctionCreateElement;
    new (): HTMLWorkflowTransitionFunctionCreateElement;
  };
  interface HTMLElementTagNameMap {
    'workflow-transition-function-create': HTMLWorkflowTransitionFunctionCreateElement;
  }
  interface ElementTagNameMap {
    'workflow-transition-function-create': HTMLWorkflowTransitionFunctionCreateElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'workflow-transition-function-create': JSXElements.WorkflowTransitionFunctionCreateAttributes;
    }
  }
  namespace JSXElements {
    export interface WorkflowTransitionFunctionCreateAttributes extends HTMLAttributes {
      'functionTypeId'?: number;
      'transitionId'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface WorkflowTransitionFunctionDetail {
      'returnUrl': string;
      'workflowTransitionFunctionId': string;
    }
  }

  interface HTMLWorkflowTransitionFunctionDetailElement extends StencilComponents.WorkflowTransitionFunctionDetail, HTMLStencilElement {}

  var HTMLWorkflowTransitionFunctionDetailElement: {
    prototype: HTMLWorkflowTransitionFunctionDetailElement;
    new (): HTMLWorkflowTransitionFunctionDetailElement;
  };
  interface HTMLElementTagNameMap {
    'workflow-transition-function-detail': HTMLWorkflowTransitionFunctionDetailElement;
  }
  interface ElementTagNameMap {
    'workflow-transition-function-detail': HTMLWorkflowTransitionFunctionDetailElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'workflow-transition-function-detail': JSXElements.WorkflowTransitionFunctionDetailAttributes;
    }
  }
  namespace JSXElements {
    export interface WorkflowTransitionFunctionDetailAttributes extends HTMLAttributes {
      'returnUrl'?: string;
      'workflowTransitionFunctionId'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface WorkflowTransitionCreate {
      'workflowId': string;
    }
  }

  interface HTMLWorkflowTransitionCreateElement extends StencilComponents.WorkflowTransitionCreate, HTMLStencilElement {}

  var HTMLWorkflowTransitionCreateElement: {
    prototype: HTMLWorkflowTransitionCreateElement;
    new (): HTMLWorkflowTransitionCreateElement;
  };
  interface HTMLElementTagNameMap {
    'workflow-transition-create': HTMLWorkflowTransitionCreateElement;
  }
  interface ElementTagNameMap {
    'workflow-transition-create': HTMLWorkflowTransitionCreateElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'workflow-transition-create': JSXElements.WorkflowTransitionCreateAttributes;
    }
  }
  namespace JSXElements {
    export interface WorkflowTransitionCreateAttributes extends HTMLAttributes {
      'workflowId'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface WorkflowTransitionDetail {
      'returnUrl': string;
      'workflowTransitionId': string;
    }
  }

  interface HTMLWorkflowTransitionDetailElement extends StencilComponents.WorkflowTransitionDetail, HTMLStencilElement {}

  var HTMLWorkflowTransitionDetailElement: {
    prototype: HTMLWorkflowTransitionDetailElement;
    new (): HTMLWorkflowTransitionDetailElement;
  };
  interface HTMLElementTagNameMap {
    'workflow-transition-detail': HTMLWorkflowTransitionDetailElement;
  }
  interface ElementTagNameMap {
    'workflow-transition-detail': HTMLWorkflowTransitionDetailElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'workflow-transition-detail': JSXElements.WorkflowTransitionDetailAttributes;
    }
  }
  namespace JSXElements {
    export interface WorkflowTransitionDetailAttributes extends HTMLAttributes {
      'returnUrl'?: string;
      'workflowTransitionId'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface WorkflowCreate {

    }
  }

  interface HTMLWorkflowCreateElement extends StencilComponents.WorkflowCreate, HTMLStencilElement {}

  var HTMLWorkflowCreateElement: {
    prototype: HTMLWorkflowCreateElement;
    new (): HTMLWorkflowCreateElement;
  };
  interface HTMLElementTagNameMap {
    'workflow-create': HTMLWorkflowCreateElement;
  }
  interface ElementTagNameMap {
    'workflow-create': HTMLWorkflowCreateElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'workflow-create': JSXElements.WorkflowCreateAttributes;
    }
  }
  namespace JSXElements {
    export interface WorkflowCreateAttributes extends HTMLAttributes {

    }
  }
}


declare global {

  namespace StencilComponents {
    interface WorkflowDetail {
      'returnUrl': string;
      'workflowId': string;
    }
  }

  interface HTMLWorkflowDetailElement extends StencilComponents.WorkflowDetail, HTMLStencilElement {}

  var HTMLWorkflowDetailElement: {
    prototype: HTMLWorkflowDetailElement;
    new (): HTMLWorkflowDetailElement;
  };
  interface HTMLElementTagNameMap {
    'workflow-detail': HTMLWorkflowDetailElement;
  }
  interface ElementTagNameMap {
    'workflow-detail': HTMLWorkflowDetailElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'workflow-detail': JSXElements.WorkflowDetailAttributes;
    }
  }
  namespace JSXElements {
    export interface WorkflowDetailAttributes extends HTMLAttributes {
      'returnUrl'?: string;
      'workflowId'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface WorkflowsList {
      'subtitle': string;
    }
  }

  interface HTMLWorkflowsListElement extends StencilComponents.WorkflowsList, HTMLStencilElement {}

  var HTMLWorkflowsListElement: {
    prototype: HTMLWorkflowsListElement;
    new (): HTMLWorkflowsListElement;
  };
  interface HTMLElementTagNameMap {
    'workflows-list': HTMLWorkflowsListElement;
  }
  interface ElementTagNameMap {
    'workflows-list': HTMLWorkflowsListElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'workflows-list': JSXElements.WorkflowsListAttributes;
    }
  }
  namespace JSXElements {
    export interface WorkflowsListAttributes extends HTMLAttributes {
      'subtitle'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface AppRoot {

    }
  }

  interface HTMLAppRootElement extends StencilComponents.AppRoot, HTMLStencilElement {}

  var HTMLAppRootElement: {
    prototype: HTMLAppRootElement;
    new (): HTMLAppRootElement;
  };
  interface HTMLElementTagNameMap {
    'app-root': HTMLAppRootElement;
  }
  interface ElementTagNameMap {
    'app-root': HTMLAppRootElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'app-root': JSXElements.AppRootAttributes;
    }
  }
  namespace JSXElements {
    export interface AppRootAttributes extends HTMLAttributes {

    }
  }
}


declare global {

  namespace StencilComponents {
    interface PageAboutPopover {

    }
  }

  interface HTMLPageAboutPopoverElement extends StencilComponents.PageAboutPopover, HTMLStencilElement {}

  var HTMLPageAboutPopoverElement: {
    prototype: HTMLPageAboutPopoverElement;
    new (): HTMLPageAboutPopoverElement;
  };
  interface HTMLElementTagNameMap {
    'page-about-popover': HTMLPageAboutPopoverElement;
  }
  interface ElementTagNameMap {
    'page-about-popover': HTMLPageAboutPopoverElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'page-about-popover': JSXElements.PageAboutPopoverAttributes;
    }
  }
  namespace JSXElements {
    export interface PageAboutPopoverAttributes extends HTMLAttributes {

    }
  }
}


declare global {

  namespace StencilComponents {
    interface PageAbout {

    }
  }

  interface HTMLPageAboutElement extends StencilComponents.PageAbout, HTMLStencilElement {}

  var HTMLPageAboutElement: {
    prototype: HTMLPageAboutElement;
    new (): HTMLPageAboutElement;
  };
  interface HTMLElementTagNameMap {
    'page-about': HTMLPageAboutElement;
  }
  interface ElementTagNameMap {
    'page-about': HTMLPageAboutElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'page-about': JSXElements.PageAboutAttributes;
    }
  }
  namespace JSXElements {
    export interface PageAboutAttributes extends HTMLAttributes {

    }
  }
}


declare global {

  namespace StencilComponents {
    interface PageAccount {

    }
  }

  interface HTMLPageAccountElement extends StencilComponents.PageAccount, HTMLStencilElement {}

  var HTMLPageAccountElement: {
    prototype: HTMLPageAccountElement;
    new (): HTMLPageAccountElement;
  };
  interface HTMLElementTagNameMap {
    'page-account': HTMLPageAccountElement;
  }
  interface ElementTagNameMap {
    'page-account': HTMLPageAccountElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'page-account': JSXElements.PageAccountAttributes;
    }
  }
  namespace JSXElements {
    export interface PageAccountAttributes extends HTMLAttributes {
      'onUserDidLogOut'?: (event: CustomEvent) => void;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface PageLogin {

    }
  }

  interface HTMLPageLoginElement extends StencilComponents.PageLogin, HTMLStencilElement {}

  var HTMLPageLoginElement: {
    prototype: HTMLPageLoginElement;
    new (): HTMLPageLoginElement;
  };
  interface HTMLElementTagNameMap {
    'page-login': HTMLPageLoginElement;
  }
  interface ElementTagNameMap {
    'page-login': HTMLPageLoginElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'page-login': JSXElements.PageLoginAttributes;
    }
  }
  namespace JSXElements {
    export interface PageLoginAttributes extends HTMLAttributes {
      'onUserDidLogIn'?: (event: CustomEvent) => void;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface PageMap {

    }
  }

  interface HTMLPageMapElement extends StencilComponents.PageMap, HTMLStencilElement {}

  var HTMLPageMapElement: {
    prototype: HTMLPageMapElement;
    new (): HTMLPageMapElement;
  };
  interface HTMLElementTagNameMap {
    'page-map': HTMLPageMapElement;
  }
  interface ElementTagNameMap {
    'page-map': HTMLPageMapElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'page-map': JSXElements.PageMapAttributes;
    }
  }
  namespace JSXElements {
    export interface PageMapAttributes extends HTMLAttributes {

    }
  }
}


declare global {

  namespace StencilComponents {
    interface PageScheduleFilter {

    }
  }

  interface HTMLPageScheduleFilterElement extends StencilComponents.PageScheduleFilter, HTMLStencilElement {}

  var HTMLPageScheduleFilterElement: {
    prototype: HTMLPageScheduleFilterElement;
    new (): HTMLPageScheduleFilterElement;
  };
  interface HTMLElementTagNameMap {
    'page-schedule-filter': HTMLPageScheduleFilterElement;
  }
  interface ElementTagNameMap {
    'page-schedule-filter': HTMLPageScheduleFilterElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'page-schedule-filter': JSXElements.PageScheduleFilterAttributes;
    }
  }
  namespace JSXElements {
    export interface PageScheduleFilterAttributes extends HTMLAttributes {

    }
  }
}


declare global {

  namespace StencilComponents {
    interface PageSchedule {

    }
  }

  interface HTMLPageScheduleElement extends StencilComponents.PageSchedule, HTMLStencilElement {}

  var HTMLPageScheduleElement: {
    prototype: HTMLPageScheduleElement;
    new (): HTMLPageScheduleElement;
  };
  interface HTMLElementTagNameMap {
    'page-schedule': HTMLPageScheduleElement;
  }
  interface ElementTagNameMap {
    'page-schedule': HTMLPageScheduleElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'page-schedule': JSXElements.PageScheduleAttributes;
    }
  }
  namespace JSXElements {
    export interface PageScheduleAttributes extends HTMLAttributes {

    }
  }
}


declare global {

  namespace StencilComponents {
    interface PageSession {
      'goback': string;
      'sessionId': string;
    }
  }

  interface HTMLPageSessionElement extends StencilComponents.PageSession, HTMLStencilElement {}

  var HTMLPageSessionElement: {
    prototype: HTMLPageSessionElement;
    new (): HTMLPageSessionElement;
  };
  interface HTMLElementTagNameMap {
    'page-session': HTMLPageSessionElement;
  }
  interface ElementTagNameMap {
    'page-session': HTMLPageSessionElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'page-session': JSXElements.PageSessionAttributes;
    }
  }
  namespace JSXElements {
    export interface PageSessionAttributes extends HTMLAttributes {
      'goback'?: string;
      'sessionId'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface PageSignup {

    }
  }

  interface HTMLPageSignupElement extends StencilComponents.PageSignup, HTMLStencilElement {}

  var HTMLPageSignupElement: {
    prototype: HTMLPageSignupElement;
    new (): HTMLPageSignupElement;
  };
  interface HTMLElementTagNameMap {
    'page-signup': HTMLPageSignupElement;
  }
  interface ElementTagNameMap {
    'page-signup': HTMLPageSignupElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'page-signup': JSXElements.PageSignupAttributes;
    }
  }
  namespace JSXElements {
    export interface PageSignupAttributes extends HTMLAttributes {

    }
  }
}


declare global {

  namespace StencilComponents {
    interface PageSpeakerDetail {
      'speakerId': string;
    }
  }

  interface HTMLPageSpeakerDetailElement extends StencilComponents.PageSpeakerDetail, HTMLStencilElement {}

  var HTMLPageSpeakerDetailElement: {
    prototype: HTMLPageSpeakerDetailElement;
    new (): HTMLPageSpeakerDetailElement;
  };
  interface HTMLElementTagNameMap {
    'page-speaker-detail': HTMLPageSpeakerDetailElement;
  }
  interface ElementTagNameMap {
    'page-speaker-detail': HTMLPageSpeakerDetailElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'page-speaker-detail': JSXElements.PageSpeakerDetailAttributes;
    }
  }
  namespace JSXElements {
    export interface PageSpeakerDetailAttributes extends HTMLAttributes {
      'speakerId'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface PageSpeakerList {

    }
  }

  interface HTMLPageSpeakerListElement extends StencilComponents.PageSpeakerList, HTMLStencilElement {}

  var HTMLPageSpeakerListElement: {
    prototype: HTMLPageSpeakerListElement;
    new (): HTMLPageSpeakerListElement;
  };
  interface HTMLElementTagNameMap {
    'page-speaker-list': HTMLPageSpeakerListElement;
  }
  interface ElementTagNameMap {
    'page-speaker-list': HTMLPageSpeakerListElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'page-speaker-list': JSXElements.PageSpeakerListAttributes;
    }
  }
  namespace JSXElements {
    export interface PageSpeakerListAttributes extends HTMLAttributes {

    }
  }
}


declare global {

  namespace StencilComponents {
    interface PageSupport {

    }
  }

  interface HTMLPageSupportElement extends StencilComponents.PageSupport, HTMLStencilElement {}

  var HTMLPageSupportElement: {
    prototype: HTMLPageSupportElement;
    new (): HTMLPageSupportElement;
  };
  interface HTMLElementTagNameMap {
    'page-support': HTMLPageSupportElement;
  }
  interface ElementTagNameMap {
    'page-support': HTMLPageSupportElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'page-support': JSXElements.PageSupportAttributes;
    }
  }
  namespace JSXElements {
    export interface PageSupportAttributes extends HTMLAttributes {

    }
  }
}


declare global {

  namespace StencilComponents {
    interface PageTabs {

    }
  }

  interface HTMLPageTabsElement extends StencilComponents.PageTabs, HTMLStencilElement {}

  var HTMLPageTabsElement: {
    prototype: HTMLPageTabsElement;
    new (): HTMLPageTabsElement;
  };
  interface HTMLElementTagNameMap {
    'page-tabs': HTMLPageTabsElement;
  }
  interface ElementTagNameMap {
    'page-tabs': HTMLPageTabsElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'page-tabs': JSXElements.PageTabsAttributes;
    }
  }
  namespace JSXElements {
    export interface PageTabsAttributes extends HTMLAttributes {

    }
  }
}


declare global {

  namespace StencilComponents {
    interface PageTutorial {

    }
  }

  interface HTMLPageTutorialElement extends StencilComponents.PageTutorial, HTMLStencilElement {}

  var HTMLPageTutorialElement: {
    prototype: HTMLPageTutorialElement;
    new (): HTMLPageTutorialElement;
  };
  interface HTMLElementTagNameMap {
    'page-tutorial': HTMLPageTutorialElement;
  }
  interface ElementTagNameMap {
    'page-tutorial': HTMLPageTutorialElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'page-tutorial': JSXElements.PageTutorialAttributes;
    }
  }
  namespace JSXElements {
    export interface PageTutorialAttributes extends HTMLAttributes {

    }
  }
}

declare global { namespace JSX { interface StencilJSX {} } }
