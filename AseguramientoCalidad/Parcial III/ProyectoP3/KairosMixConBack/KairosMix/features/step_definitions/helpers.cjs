const { render, screen, waitFor } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;
const assert = require('assert/strict');

// Este archivo contiene funciones de ayuda comunes para las pruebas de Cucumber

const renderComponent = (component) => {
  return render(component);
};

const getElement = (testId, options = {}) => {
  return screen.getByTestId(testId, options);
};

const getElementByText = (text) => {
  return screen.getByText(text);
};

const fillInput = async (testId, value) => {
  const input = getElement(testId);
  await userEvent.clear(input);
  await userEvent.type(input, value);
};

const clickButton = async (testId) => {
  const button = getElement(testId);
  await userEvent.click(button);
};

const waitForElement = async (testId, timeout = 1000) => {
  return await waitFor(() => {
    return getElement(testId);
  }, { timeout });
};

const expectText = (text) => {
  assert.ok(screen.getByText(text));
};

const expectElementVisible = (testId) => {
  const element = getElement(testId);
  assert.ok(element);
};

module.exports = {
  renderComponent,
  getElement,
  getElementByText,
  fillInput,
  clickButton,
  waitForElement,
  expectText,
  expectElementVisible,
};
