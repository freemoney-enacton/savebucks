import { public_get_api } from '@/Hook/Api/Server/use-server';
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import PhoneInput from './PhoneInput';

const Input = forwardRef<any, any>(function Input(
  {
    type,
    placeholder,
    id,
    customClass,
    label,
    onChange,
    hint,
    icon,
    required = false,
    isTag = false,
    readOnly = false,
    button,
    ...rest
  },
  ref
) {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<any>([]);
  const [showUserList, setShowUserList] = useState(false);

  useImperativeHandle(ref, () => ({
    handleUserSelect,
    setInputValue,
    inputValue,
  }));

  const fetchTagUsers = useDebouncedCallback(async (query) => {
    try {
      const response = await public_get_api({
        path: `user/public-profile/list?q=${query}`,
      });
      setFilteredUsers(response.data);
      setShowUserList(response.data.length > 0);
    } catch (error) {
      console.error('Error fetching filtered users:', error);
    }
  }, 300);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);
    onChange && onChange(e);

    if (isTag) {
      const lastAtIndex = value.lastIndexOf('@');
      if (lastAtIndex > -1) {
        const query = value.slice(lastAtIndex + 1);
        if (query.trim().length > 0) {
          // Fetch users matching the query from DEMO API
          await fetchTagUsers(query);
        } else {
          setFilteredUsers([]);
          setShowUserList(false);
        }
      } else {
        setShowUserList(false);
      }
    }
  };

  const handleUserSelect = (user, isAppend = false) => {
    let newValue = inputValue;
    if (isAppend) {
      newValue = inputValue + `[@uid-${user.referral_code || user.user_referral_code}] `;
    } else {
      newValue = inputValue.slice(0, inputValue.lastIndexOf('@')) + `[@uid-${user.referral_code || user.user_referral_code}] `;
    }
    setInputValue(newValue);
    setShowUserList(false);

    // Create a synthetic event to propagate the change up
    const syntheticEvent = {
      target: {
        name: id,
        value: newValue,
      },
    };
    onChange && onChange(syntheticEvent);
    document.getElementById(id)?.focus();
  };

  return (
    <div className="space-y-1.5 input-wrapper">
      {label && (
        <label htmlFor={id} className="text-white text-sm font-medium">
          {label} {required ? <span className="text-red">*</span> : null}
        </label>
      )}
      <div className="relative">
        {!!icon && <div className="absolute inset-y-0 left-5 grid place-content-center z-[1]">{icon}</div>}
        {type === 'phone' ? (
          <div className="relative">
            {!!isTag && showUserList && (
              <ul className="absolute bottom-14 max-h-40 w-full py-2 bg-black-250 rounded-2xl text-gray-400 overflow-y-auto z-10">
                {filteredUsers.map((user: any) => (
                  <li
                    key={user.id}
                    className="cursor-pointer py-2 px-4 hover:bg-gray-800 transition-ease line-clamp-1 break-all"
                    onClick={() => handleUserSelect(user)}
                  >
                    {user.name}
                  </li>
                ))}
              </ul>
            )}
            <PhoneInput
              placeholder={placeholder}
              name={id}
              id={id}
              onChange={onChange}
              readOnly={readOnly}
              button={button}
              {...rest}
            />
            {!!readOnly && (
              <div className="absolute inset-y-0 right-5 grid place-content-center">
                <LockClosedIcon className="size-4" />
              </div>
            )}
            {!!button && <div className="absolute inset-y-0 right-1.5 grid place-content-center">{button}</div>}
          </div>
        ) : (
          <div className="relative">
            {!!isTag && showUserList && (
              <ul className="absolute bottom-14 max-h-40 w-full py-2 bg-black-250 rounded-2xl text-gray-400 overflow-y-auto z-10">
                {filteredUsers.map((user: any) => (
                  <li
                    key={user.id}
                    className="cursor-pointer py-2 px-4 hover:bg-gray-800 transition-ease line-clamp-1 break-all"
                    onClick={() => handleUserSelect(user)}
                  >
                    {user.name}
                  </li>
                ))}
              </ul>
            )}
            <input
              className={`py-3 px-5 w-full bg-transparent !bg-input-gr rounded-lg border-0 placeholder:text-gray-700 placeholder:text-sm focus:ring-0 focus:border-0 focus:shadow-md outline-none text-base transition-ease ${
                customClass ? customClass : ''
              } ${icon ? 'pl-14' : ''} ${readOnly ? 'pr-14' : ''} ${button ? 'pr-24' : ''} ${
                type === 'password' && 'pr-12'
              } input-class`}
              type={type === 'password' && isPasswordVisible ? 'text' : type}
              placeholder={placeholder}
              name={id}
              id={id}
              value={inputValue}
              onChange={handleInputChange}
              readOnly={readOnly}
              {...rest}
            />
            {type === 'password' && (
              <button
                type="button"
                className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <EyeSlashIcon className="size-5 text-secondary-text" />
                ) : (
                  <EyeIcon className="size-5 text-secondary-text" />
                )}
              </button>
            )}
            {!!readOnly && (
              <div className="absolute inset-y-0 right-5 grid place-content-center">
                <LockClosedIcon className="size-4" />
              </div>
            )}
            {!!button && <div className="absolute inset-y-0 right-1.5 grid place-content-center">{button}</div>}
          </div>
        )}
      </div>
      {hint !== undefined && <p className="block text-red text-xs">{hint}</p>}
    </div>
  );
});

export default Input;
