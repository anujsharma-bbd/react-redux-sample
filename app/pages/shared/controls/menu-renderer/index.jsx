import classNames from 'classnames';
import React from 'react';
/**
 * to highlight selected item for select list control
 */
let menuRenderer = ({
				focusedOption,
				instancePrefix,
				labelKey,
				onFocus,
				onSelect,
				optionClassName,
				optionComponent,
				optionRenderer,
				options,
				valueArray,
				valueKey,
				onOptionRef
}) => {
				let IsExists = (ddArray, selectedValue) => {
								let focusedOptionIndex = ddArray.findIndex(x => JSON.stringify(x[valueKey]) === JSON.stringify(selectedValue[valueKey]));
								if (focusedOptionIndex !== -1) {
												return true;
								}
								return false;
				};
				let Option = optionComponent;
				return options.map(function (option, i) {
								let isSelected = valueArray && IsExists(valueArray, option);
								let isFocused = option === focusedOption;
								let optionClass = classNames(optionClassName, {
												'Select-option': true,
												'is-selected': isSelected,
												'is-focused': isFocused,
												'is-disabled': option.disabled
								});

								return (
												<Option
																className={optionClass}
																instancePrefix={instancePrefix}
																isDisabled={option.disabled}
																isFocused={isFocused}
																isSelected={isSelected}
																key={`option-${i}-${option[valueKey]}`}
																onFocus={onFocus}
																onSelect={onSelect}
																option={option}
																optionIndex={i}
																ref={ref => {
																onOptionRef(ref, isFocused);
												}}>
																{optionRenderer(option, i)}
												</Option>
								);
				});
}
exports.menuRenderer = menuRenderer;
