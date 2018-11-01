
export default function requestActions(name) {
  return {
    REQUEST: name,
    SUCCESS: `${name}_SUCCESS`,
    FAIL: `${name}_FAIL`,
  };
}