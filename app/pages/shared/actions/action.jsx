
/**
 * Get the action to be dispatched from view.
 */
export function getAction(actionType,payload){
  return {
      type:actionType,
      payload
    };
}
