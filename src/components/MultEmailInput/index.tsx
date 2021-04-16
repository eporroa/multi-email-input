import React, { Component, createRef } from "react";
import isEmailFn from "utils/is-email";

import { IReactMultiEmailProps, IReactMultiEmailState } from "interfaces";

import MultiEmailInputWrapper from "./Wrapper";
import MultiEmailInputSuggestions from "./Suggestions";

class ReactMultiEmail extends Component<
  IReactMultiEmailProps,
  IReactMultiEmailState
> {
  state = {
    focused: false,
    emails: [],
    inputValue: "",
    activeSuggestion: 0,
    filteredSuggestions: [],
    showSuggestions: false,
    userInput: "",
  };

  emailInputRef: React.RefObject<HTMLInputElement>;

  static getDerivedStateFromProps(
    nextProps: IReactMultiEmailProps,
    prevState: IReactMultiEmailState
  ) {
    if (prevState.propsEmails !== nextProps.emails) {
      return {
        propsEmails: nextProps.emails || [],
        emails: nextProps.emails || [],
        inputValue: "",
        focused: false,
      };
    }
    return null;
  }

  constructor(props: IReactMultiEmailProps) {
    super(props);
    this.emailInputRef = createRef();
  }

  findEmailAddress = (value: string, isEnter?: boolean) => {
    const { validateEmail } = this.props;
    let validEmails: string[] = [];
    let inputValue: string = "";
    const re = /[ ,;]/g;
    const isEmail = validateEmail || isEmailFn;

    const addEmails = (email: string) => {
      const emails: string[] = this.state.emails;
      for (let i = 0, l = emails.length; i < l; i++) {
        if (emails[i] === email) {
          return false;
        }
      }
      validEmails.push(email);
      return true;
    };

    if (value !== "") {
      if (re.test(value)) {
        let splitData = value.split(re).filter((n) => {
          return n !== "" && n !== undefined && n !== null;
        });

        const setArr = new Set(splitData);
        let arr = [];
        arr = Array.from(setArr);

        do {
          if (isEmail("" + arr[0])) {
            addEmails("" + arr.shift());
          } else {
            if (arr.length === 1) {
              inputValue = "" + arr.shift();
            } else {
              arr.shift();
            }
          }
        } while (arr.length);
      } else {
        if (isEnter) {
          if (isEmail(value)) {
            addEmails(value);
          } else {
            inputValue = value;
          }
        } else {
          inputValue = value;
        }
      }
    }

    this.setState({
      emails: [...this.state.emails, ...validEmails],
      inputValue: inputValue,
    });

    if (validEmails.length && this.props.onChange) {
      this.props.onChange([...this.state.emails, ...validEmails]);
    }
  };

  onChangeInputValue = (value: string) => {
    this.findEmailAddress(value);
  };

  removeEmail = (index: number) => {
    this.setState(
      (prevState) => {
        return {
          emails: [
            ...prevState.emails.slice(0, index),
            ...prevState.emails.slice(index + 1),
          ],
        };
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.emails);
        }
      }
    );
  };

  handleOnKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { activeSuggestion, filteredSuggestions } = this.state;
    switch (e.which) {
      case 13:
        this.setState({
          activeSuggestion: 0,
          showSuggestions: false,
          userInput: filteredSuggestions[activeSuggestion],
        });
        if (filteredSuggestions[activeSuggestion]) {
          this.findEmailAddress(filteredSuggestions[activeSuggestion], true);
        }
        break;
      case 9:
        e.preventDefault();
        break;
      case 8:
        if (!e.currentTarget.value) {
          this.removeEmail(this.state.emails.length - 1);
        }
        break;
      case 38:
        if (activeSuggestion === 0) {
          return;
        }
        this.setState({ activeSuggestion: activeSuggestion - 1 });
        break;
      case 40:
        if (activeSuggestion - 1 === filteredSuggestions.length) {
          return;
        }
        this.setState({ activeSuggestion: activeSuggestion + 1 });
        break;
      default:
    }
  };

  handleOnKeyup = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.which) {
      case 13:
      case 9:
        this.findEmailAddress(e.currentTarget.value, true);
        break;
      default:
    }
  };

  handleOnChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;

    const filteredSuggestions = suggestions.filter(
      (suggestion: any) =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value,
    });
    this.onChangeInputValue(e.currentTarget.value);
  };

  handleOnBlur = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({ focused: false });
    this.findEmailAddress(e.currentTarget.value, true);
  };

  handleOnFocus = () =>
    this.setState({
      focused: true,
    });

  onClick = (e: any) => {
    const emailEnter = e.currentTarget.innerText;
    this.onChangeInputValue(emailEnter);
    this.findEmailAddress(emailEnter, true);
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: emailEnter,
    });
  };
  render() {
    const { focused, emails, inputValue } = this.state;
    const {
      style,
      getLabel,
      className = "",
      noClass,
      placeholder,
    } = this.props;
    const {
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
      },
    } = this;
    let suggestionsListComponent;
    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <MultiEmailInputSuggestions>
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }
              return (
                <li
                  className={className}
                  key={suggestion}
                  onClick={this.onClick}
                >
                  {suggestion}
                </li>
              );
            })}
          </MultiEmailInputSuggestions>
        );
      }
    }

    return (
      <>
        <MultiEmailInputWrapper
          className={`${className} ${noClass ? "" : "react-multi-email"} ${
            focused ? "focused" : ""
          } ${inputValue === "" && emails.length === 0 ? "empty" : ""}`}
          style={style}
          onClick={() => {
            if (this.emailInputRef.current) {
              this.emailInputRef.current.focus();
            }
          }}
        >
          {placeholder ? <span data-placeholder>{placeholder}</span> : null}
          {emails.map((email, index) =>
            getLabel(email, index, this.removeEmail)
          )}
          <input
            ref={this.emailInputRef}
            type="text"
            value={inputValue}
            onFocus={this.handleOnFocus}
            onBlur={this.handleOnBlur}
            onChange={this.handleOnChange}
            onKeyDown={this.handleOnKeydown}
            onKeyUp={this.handleOnKeyup}
          />
        </MultiEmailInputWrapper>
        {suggestionsListComponent}
      </>
    );
  }
}

export default ReactMultiEmail;
