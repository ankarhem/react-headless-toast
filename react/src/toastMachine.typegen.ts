// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.entering': {
      type: 'done.invoke.entering';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.exiting': {
      type: 'done.invoke.exiting';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.idling': {
      type: 'done.invoke.idling';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.entering': {
      type: 'error.platform.entering';
      data: unknown;
    };
    'error.platform.exiting': { type: 'error.platform.exiting'; data: unknown };
    'error.platform.idling': { type: 'error.platform.idling'; data: unknown };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {
    entering: 'done.invoke.entering';
    exiting: 'done.invoke.exiting';
    idling: 'done.invoke.idling';
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    toastRemoved: 'done.invoke.exiting';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    entering: 'xstate.init';
    exiting: 'REMOVE' | 'done.invoke.idling';
    idling: 'RESUME' | 'done.invoke.entering';
  };
  matchesStates:
    | 'entering'
    | 'exiting'
    | 'idle'
    | 'idle.active'
    | 'idle.paused'
    | 'summoned'
    | { idle?: 'active' | 'paused' };
  tags: never;
}
