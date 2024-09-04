import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Minus, Plus } from '../../assets/icons';
import { toast } from 'react-toastify';

const NumberInput = ({ initialValue = 1, minValue, maxValue, onChange, onClick = () => {}, identifier }) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue, identifier]);

    const handleIncrement = (e) => {
        if (maxValue === undefined || value < maxValue) {
            setValue(value + 1);
            onChange(e, value + 1, identifier);
        } else if (value === maxValue) {
            toast.error(`Sorry. You can only buy ${maxValue} pieces`);
        }
    };

    const handleDecrement = (e) => {
        if (minValue === undefined || value > minValue) {
            if (value > 1) {
                setValue(value - 1);
                onChange(e, value - 1, identifier);
            }
        }
    };

    const handleChange = (e) => {
        const inputValue = e.target.value.trim();
        const newValue = inputValue === '' ? '' : parseInt(inputValue) || 1;
        setValue(newValue);
        onChange(e, newValue, identifier);
    };

    const handleBlur = (e) => {
        const inputValue = e.target.value.trim();
        if (inputValue === '') {
            setValue(1);
            onChange(e, 1, identifier);
        } else if (parseInt(inputValue) > maxValue) {
            setValue(1);
            onChange(e, 1, identifier);
            toast.error(`Sorry. You can only buy ${maxValue} pieces`);
        }
    };

    const handleClick = (e) => {
        onClick(e);
    };

    return (
        <div className="grid md:grid-cols-[1fr_50px_1fr] md:w-[120px] w-[80] grid-cols-[1fr_30px_1fr]">
            <div
                className="minus-button border border-grey-300 py-[3px] font-body font-[600] flex items-center justify-center cursor-pointer"
                onClick={handleDecrement}
            >
                <Minus className="fill-dark" />
            </div>
            <input
                className="input border border-grey-300 py-[3px] px-[3px] font-body text-center"
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                onClick={handleClick}
                id={identifier}
            />
            <div
                className="add-button border border-grey-300 py-[3px] font-body font-[600] flex items-center justify-center cursor-pointer"
                onClick={handleIncrement}
            >
                <Plus className="fill-dark" />
            </div>
        </div>
    );
};

NumberInput.propTypes = {
    initialValue: PropTypes.number,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    identifier: PropTypes.string,
};

export default NumberInput;
