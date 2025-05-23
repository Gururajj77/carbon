/**
 * Copyright IBM Corp. 2021, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { LitElement } from 'lit';
import { prefix } from '../../globals/settings';
import { carbonElement as customElement } from '../../globals/decorators/carbon-element';
import styles from './side-nav.scss?lit';

/**
 * A divider in side nav.
 *
 * @element cds-side-nav-divider
 */
@customElement(`${prefix}-side-nav-divider`)
class CDSSideNavDivider extends LitElement {
  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'separator');
    }
    super.connectedCallback();
  }

  static styles = styles;
}

export default CDSSideNavDivider;
