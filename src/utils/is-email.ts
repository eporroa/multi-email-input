/* eslint-disable no-control-regex */
import { IEmailOptions } from "../interfaces";
import isFQDN from "./is-fqdn";

const defaultEmailOptions = {
  allowDisplayName: false,
  requireDisplayName: false,
  allowUtf8LocalPart: true,
  requireTld: true,
};

const displayName = /^[a-z\d!#$%&'*+\-/=?^_`{|}~.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#$%&'*+\-/=?^_`{|}~,.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
const emailUserPart = /^[a-z\d!#$%&'*+\-/=?^_`{|}~]+$/i;
const quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
const emailUserUtf8Part = /^[a-z\d!#$%&'*+\-/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
const quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;

function isByteLength(str: string, options: { min?: number; max?: number }) {
  let min: number = 0;
  let max: number | undefined;
  const len = encodeURI(str).split(/%..|./).length - 1;

  if (options) {
    min = Number(options.min) || 0;
    max = Number(options.max);
  }

  return len >= min && (typeof max === "undefined" || len <= max);
}

function isEmail(str: string, options?: IEmailOptions) {
  options = { ...defaultEmailOptions, ...options };

  if (options.requireDisplayName || options.allowDisplayName) {
    const displayEmail = str.match(displayName);
    if (displayEmail) {
      str = displayEmail[1];
    } else if (options.requireDisplayName) {
      return false;
    }
  }

  const parts: string[] = str.split("@");
  const domain: string = "" + parts.pop();
  const lowerDomain = domain.toLowerCase();
  let user: string = parts.join("@");

  if (lowerDomain === "gmail.com" || lowerDomain === "googlemail.com") {
    user = user.replace(/\./g, "").toLowerCase();
  }

  if (!isByteLength(user, { max: 64 }) || !isByteLength(domain, { max: 254 })) {
    return false;
  }

  if (!isFQDN(domain, { requireTld: options.requireTld })) {
    return false;
  }

  if (user[0] === '"') {
    user = user.slice(1, user.length - 1);
    return options.allowUtf8LocalPart
      ? quotedEmailUserUtf8.test(user)
      : quotedEmailUser.test(user);
  }

  const pattern = options.allowUtf8LocalPart
    ? emailUserUtf8Part
    : emailUserPart;
  const userParts = user.split(".");

  for (let i = 0; i < userParts.length; i++) {
    if (!pattern.test(userParts[i])) {
      return false;
    }
  }

  return true;
}

export default isEmail;
