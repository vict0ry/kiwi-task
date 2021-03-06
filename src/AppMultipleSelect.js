/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Input from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import ArrowDropDownIcon from 'material-ui-icons/ArrowDropDown';
import CancelIcon from 'material-ui-icons/Cancel';
import ArrowDropUpIcon from 'material-ui-icons/ArrowDropUp';
import ClearIcon from 'material-ui-icons/Clear';
import Chip from 'material-ui/Chip';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import axios from 'axios';
import {debounce} from 'lodash';


class Option extends React.Component {
  handleClick = event => {
    this.props.onSelect(this.props.option, event);
  };

  render() {
    const { children, isFocused, isSelected, onFocus } = this.props;

    return (
      <MenuItem
        onFocus={onFocus}
        selected={isFocused}
        onClick={this.handleClick}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}>
        {children}
      </MenuItem>
    );
  }
}

function SelectWrapped(props) {
  const { classes, ...other } = props;

  return (
    <Select
      optionComponent={Option}
      noResultsText={<Typography>{'Start typing'}</Typography>}
      arrowRenderer={arrowProps => {
        return arrowProps.isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />;
      }}
      clearRenderer={() => <ClearIcon />}
      valueComponent={valueProps => {
        const { value, children, onRemove } = valueProps;

        const onDelete = event => {
          event.preventDefault();
          event.stopPropagation();
          onRemove(value);
        };

        if (onRemove) {
          return (
            <Chip
              tabIndex={-1}
              label={children}
              className={classes.chip}
              deleteIcon={<CancelIcon onTouchEnd={onDelete} />}
              onDelete={onDelete}
            />
          );
        }

        return <div className="Select-value">{children}</div>;
      }}
      {...other}
    />
  );
}

const ITEM_HEIGHT = 48;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 200,
    width: '100%',
  },
  chip: {
    margin: theme.spacing.unit / 4,
    height: 'unset',
  },
  // We had to use a lot of global selectors in order to style react-select.
  // We are waiting on https://github.com/JedWatson/react-select/issues/1679
  // to provide a better implementation.
  // Also, we had to reset the default style injected by the library.
  '@global': {
    '.Select-control': {
      display: 'flex',
      alignItems: 'center',
      border: 0,
      height: 'auto',
      background: 'transparent',
      '&:hover': {
        boxShadow: 'none',
      },
    },
    '.Select-multi-value-wrapper': {
      flexGrow: 1,
      display: 'flex',
      flexWrap: 'wrap',
    },
    '.Select--multi .Select-input': {
      margin: 0,
    },
    '.Select-noresults': {
      padding: theme.spacing.unit * 2,
    },
    '.Select-input': {
      display: 'inline-flex !important',
      padding: 0,
      height: 'auto',
    },
    '.Select-input input': {
      background: 'transparent',
      border: 0,
      padding: 0,
      cursor: 'default',
      display: 'inline-block',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      margin: 0,
      outline: 0,
    },
    '.Select-placeholder': {
      opacity: 0.42,
      color: theme.palette.common.black,
    },
    '.Select-menu-outer': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      position: 'absolute',
      left: 0,
      top: `calc(100% + ${theme.spacing.unit}px)`,
      width: '100%',
      zIndex: 2,
      maxHeight: ITEM_HEIGHT * 4.5,
    },
    '.Select.is-focused:not(.is-open) > .Select-control': {
      boxShadow: 'none',
    },
    '.Select-menu': {
      maxHeight: ITEM_HEIGHT * 4.5,
      overflowY: 'auto',
    },
    '.Select-menu div': {
      boxSizing: 'content-box',
    },
    '.Select-arrow-zone, .Select-clear-zone': {
      color: theme.palette.action.active,
      cursor: 'pointer',
      height: 21,
      width: 21,
      zIndex: 1,
    },
    // Only for screen readers. We can't use display none.
    '.Select-aria-only': {
      position: 'absolute',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      height: 1,
      width: 1,
      margin: -1,
    },
  },
});

class IntegrationReactSelect extends React.Component {
  state = {
    value: this.props.name,
    multi: '',
    suggestions: []
  };
  fillWithWhispears(res) {
    let arrOfSuggestions = this.state.suggestions;
      res.data.locations.map((item) => {
          const isUnique = arrOfSuggestions.filter(arr => arr.label === item.name).length === 0;
          if (isUnique) {
            arrOfSuggestions.push({
              value: item.code,
              label: item.name
            })
          }
      });
      this.setState({
        suggestions: arrOfSuggestions
      });
  }
  getWhispers(data) {
     if(data.length) {
        axios.get(`https://api.skypicker.com/locations/?term=${data.split(',').pop()}&v=2&locale=en-US`)
        .then(response => this.fillWithWhispears(response))
        .catch(error => {
          console.log(error.response)
        });
     }

  }

  handleChangeMulti = multi => {
    this.setState({
      multi,
      name: this.props.name
    });
    this.props.selectChanged({
        multi,
        name: this.props.name
      });
  };
  callWhispearAndUpdate = debounce((fieldValue) => {
    this.getWhispers(fieldValue.value);
    this.forceUpdate();
  }, 300, false);
  onKeyDown(e) {
      let fieldValue = '';
      fieldValue = e.target;
      if(fieldValue) {
        this.callWhispearAndUpdate(fieldValue);
      }
  }


  render() {
    
    const { classes } = this.props;
    const { multi } = this.state;
    return (
      <div id="lookup" className={classes.root} onChange={this.onKeyDown.bind(this)}>

        <Input
          fullWidth
          inputComponent={SelectWrapped}
          name="from"
          inputProps={{
            classes,
            value: multi,
            multi: true,
            onChange: this.handleChangeMulti.bind(this),
            placeholder: this.props.placeholder,
            instanceId: 'react-select-chip',
            id: 'react-select-chip',
            name: 'react-select-chip',
            simpleValue: true,
            options: this.state.suggestions,
          }}
        />
      </div>
    );
  }
}

IntegrationReactSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IntegrationReactSelect);