/**
 * Created by randall on 1/28/17.
 */
import { inject, bindable } from 'aurelia-framework';
import * as Interact from 'interact';
import InteractBase from 'aurelia-interactjs/interact-base';

@inject(Element, Interact)
export class BazingoDraggableCustomAttribute extends InteractBase {
  @bindable value;
  @bindable enabled;

  constructor(element, interact) {
    super(element, interact.interact);
  }

  bind() {
    this.unsetInteractJs();
    this.interactable = this.interact(this.element, this.getInteractableOptions())
      .draggable(this.getActionOptions())
      .on('dragstart', (event) => this.dispatch('interact-dragstart', event))
      .on('dragmove', (event) => this.dispatch('interact-dragmove', event))
      .on('draginertiastart', (event) => this.dispatch('interact-draginertiastart', event))
      .on('dragend', (event) => this.dispatch('interact-dragend', event));
  }

  enabledChanged(newValue, oldValue) {
    this.interactable.draggable(newValue);
  }
}
