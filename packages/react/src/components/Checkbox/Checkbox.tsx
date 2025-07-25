/**
 * Copyright IBM Corp. 2016, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { cloneElement, type ReactNode } from 'react';
import classNames from 'classnames';
import { Text } from '../Text';
import { deprecate } from '../../prop-types/deprecate';
import { usePrefix } from '../../internal/usePrefix';
import { WarningFilled, WarningAltFilled } from '@carbon/icons-react';
import { useId } from '../../internal/useId';
import { noopFn } from '../../internal/noopFn';
import { AILabel } from '../AILabel';
import { isComponentElement } from '../../internal';

type ExcludedAttributes = 'id' | 'onChange' | 'onClick' | 'type';

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    ExcludedAttributes
  > {
  /**
   * Provide an `id` to uniquely identify the Checkbox input
   */
  id: string;

  /**
   * Provide a label to provide a description of the Checkbox input that you are
   * exposing to the user
   */
  labelText: NonNullable<ReactNode>;

  /**
   * **Experimental**: Provide a `decorator` component to be rendered inside the `Checkbox` component
   */
  decorator?: ReactNode;

  /**
   * Specify whether the underlying input should be checked by default
   */
  defaultChecked?: boolean;

  /**
   * Specify whether the Checkbox should be disabled
   */
  disabled?: boolean;

  /**
   * Provide text for the form group for additional help
   */
  helperText?: ReactNode;

  /**
   * Specify whether the label should be hidden, or not
   */
  hideLabel?: boolean;

  /**
   * Specify whether the Checkbox is in an indeterminate state
   */
  indeterminate?: boolean;

  /**
   * Specify whether the Checkbox is currently invalid
   */
  invalid?: boolean;

  /**
   * Provide the text that is displayed when the Checkbox is in an invalid state
   */
  invalidText?: ReactNode;

  /**
   * @deprecated please use decorator instead.
   * **Experimental**: Provide a `Slug` component to be rendered inside the `Checkbox` component
   */
  slug?: ReactNode;

  /**
   * Specify whether the Checkbox is currently invalid
   */
  warn?: boolean;

  /**
   * Provide the text that is displayed when the Checkbox is in an invalid state
   */
  warnText?: ReactNode;

  /**
   * Provide an optional handler that is called when the internal state of
   * Checkbox changes. This handler is called with event and state info.
   * `(event, { checked, id }) => void`
   */
  onChange?: (
    evt: React.ChangeEvent<HTMLInputElement>,
    data: { checked: boolean; id: string }
  ) => void;

  /**
   * Provide an optional onClick handler that is called on click
   */
  onClick?: (evt: React.MouseEvent<HTMLInputElement>) => void;
}

const Checkbox = React.forwardRef(
  (
    {
      className,
      decorator,
      helperText,
      id,
      labelText,
      onChange = noopFn,
      onClick,
      indeterminate = false,
      invalid,
      invalidText,
      hideLabel,
      readOnly,
      title = '',
      warn,
      warnText,
      slug,
      ...other
    }: CheckboxProps,
    ref
  ) => {
    const prefix = usePrefix();

    const showWarning = !readOnly && !invalid && warn;
    const showHelper = !invalid && !warn;

    const checkboxGroupInstanceId = useId();

    const helperId = !helperText
      ? undefined
      : `checkbox-helper-text-${checkboxGroupInstanceId}`;

    const helper = helperText ? (
      <div id={helperId} className={`${prefix}--form__helper-text`}>
        {helperText}
      </div>
    ) : null;

    const wrapperClasses = classNames(
      `${prefix}--form-item`,
      `${prefix}--checkbox-wrapper`,
      className,
      {
        [`${prefix}--checkbox-wrapper--readonly`]: readOnly,
        [`${prefix}--checkbox-wrapper--invalid`]: !readOnly && invalid,
        [`${prefix}--checkbox-wrapper--warning`]: showWarning,
        [`${prefix}--checkbox-wrapper--slug`]: slug,
        [`${prefix}--checkbox-wrapper--decorator`]: decorator,
      }
    );
    const innerLabelClasses = classNames(`${prefix}--checkbox-label-text`, {
      [`${prefix}--visually-hidden`]: hideLabel,
    });

    const candidate = slug ?? decorator;
    const candidateIsAILabel = isComponentElement(candidate, AILabel);
    const normalizedDecorator = candidateIsAILabel
      ? cloneElement(candidate, {
          size: candidate.props.kind === 'inline' ? 'md' : 'mini',
        })
      : null;

    return (
      <div className={wrapperClasses}>
        <input
          {...other}
          type="checkbox"
          data-invalid={invalid ? true : undefined}
          onChange={(evt) => {
            if (!readOnly && onChange) {
              onChange(evt, { checked: evt.target.checked, id });
            }
          }}
          className={`${prefix}--checkbox`}
          id={id}
          ref={(el) => {
            if (el) {
              el.indeterminate = indeterminate ?? false;
            }
            if (typeof ref === 'function') {
              ref(el);
            } else if (ref && 'current' in ref) {
              ref.current = el;
            }
          }}
          // readonly attribute not applicable to type="checkbox"
          // see - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
          aria-readonly={readOnly}
          onClick={(evt) => {
            if (readOnly) {
              // prevent default stops the checkbox being updated
              evt.preventDefault();
            }
            // pass onClick event on to the user even if readonly
            if (onClick) {
              onClick(evt);
            }
          }}
        />
        <label
          htmlFor={id}
          className={`${prefix}--checkbox-label`}
          title={title}>
          <Text className={innerLabelClasses}>
            {labelText}
            {slug ? (
              normalizedDecorator
            ) : decorator ? (
              <div className={`${prefix}--checkbox-wrapper-inner--decorator`}>
                {normalizedDecorator}
              </div>
            ) : (
              ''
            )}
          </Text>
        </label>
        <div className={`${prefix}--checkbox__validation-msg`}>
          {!readOnly && invalid && (
            <>
              <WarningFilled className={`${prefix}--checkbox__invalid-icon`} />
              <div className={`${prefix}--form-requirement`}>{invalidText}</div>
            </>
          )}
          {showWarning && (
            <>
              <WarningAltFilled
                className={`${prefix}--checkbox__invalid-icon ${prefix}--checkbox__invalid-icon--warning`}
              />
              <div className={`${prefix}--form-requirement`}>{warnText}</div>
            </>
          )}
        </div>
        {showHelper && helper}
      </div>
    );
  }
);

Checkbox.propTypes = {
  /**
   * Specify whether the underlying input should be checked
   */
  checked: PropTypes.bool,

  /**
   * Specify an optional className to be applied to the <label> node
   */
  className: PropTypes.string,

  /**
   * **Experimental**: Provide a decorator component to be rendered inside the `Checkbox` component
   */
  decorator: PropTypes.node,

  /**
   * Specify whether the underlying input should be checked by default
   */
  defaultChecked: PropTypes.bool,

  /**
   * Specify whether the Checkbox should be disabled
   */
  disabled: PropTypes.bool,

  /**
   * Provide text for the form group for additional help
   */
  helperText: PropTypes.node,

  /**
   * Specify whether the label should be hidden, or not
   */
  hideLabel: PropTypes.bool,

  /**
   * Provide an `id` to uniquely identify the Checkbox input
   */
  id: PropTypes.string.isRequired,

  /**
   * Specify whether the Checkbox is in an indeterminate state
   */
  indeterminate: PropTypes.bool,

  /**
   * Specify whether the Checkbox is currently invalid
   */
  invalid: PropTypes.bool,

  /**
   * Provide the text that is displayed when the Checkbox is in an invalid state
   */
  invalidText: PropTypes.node,

  /**
   * Provide a label to provide a description of the Checkbox input that you are
   * exposing to the user
   */
  labelText: PropTypes.node.isRequired,

  /**
   * Provide an optional handler that is called when the internal state of
   * Checkbox changes. This handler is called with event and state info.
   * `(event, { checked, id }) => void`
   */
  onChange: PropTypes.func,

  /**
   * Specify whether the Checkbox is read-only
   */
  readOnly: PropTypes.bool,

  /**
   * **Experimental**: Provide a `Slug` component to be rendered inside the `Checkbox` component
   */
  slug: deprecate(
    PropTypes.node,
    'The `slug` prop has been deprecated and will be removed in the next major version. Use the decorator prop instead.'
  ),

  /**
   * Specify a title for the <label> node for the Checkbox
   */
  title: PropTypes.string,

  /**
   * Specify whether the Checkbox is currently in warning state
   */
  warn: PropTypes.bool,

  /**
   * Provide the text that is displayed when the Checkbox is in warning state
   */
  warnText: PropTypes.node,
};

Checkbox.displayName = 'Checkbox';

export default Checkbox;
