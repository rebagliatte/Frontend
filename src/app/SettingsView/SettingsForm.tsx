import * as React from 'react';
import { InjectedFormikProps, Form, Field, withFormik } from 'formik';
import { firebase, firestore, useAuth } from 'gatsby-theme-firebase';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Spinner,
  FormHelperText,
  Stack,
  Box,
  useToastOptions,
  useToast,
  Checkbox,
  CheckboxGroup,
  InputGroup,
  InputLeftAddon
} from '@chakra-ui/core';
import withPerson from '../../hooks/withPerson';
import useAnalytics from '../../hooks/useAnalytics';

interface FormValues {
  displayName: Date;
  should_show_profileURL: boolean;
  preferences: any;
  smsNumber: string;
}

const InnerForm: React.FC<InjectedFormikProps<
  SettingsFormProps,
  FormValues
>> = (props) => {
  const { touched, errors, isSubmitting, setFieldValue } = props;

  return (
    <Form>
      <Stack spacing={6}>
        <Box>
          <Field name="displayName">
            {({ field }) => (
              <FormControl
                isInvalid={errors[field.name] && touched[field.name]}
              >
                <FormLabel htmlFor={field.name}>Display Name</FormLabel>
                <Input {...field} />
                <FormHelperText id="email-helper-text">
                  This is public so other can find you.
                </FormHelperText>
              </FormControl>
            )}
          </Field>
        </Box>
        <Box>
          <Field name="preferences">
            {(field) => (
              <FormControl>
                <FormLabel>Notification Preferences</FormLabel>
                <CheckboxGroup
                  name="preferences"
                  onChange={(e) => {
                    // check if sms deselected and sms is available, clear sms number
                    if (
                      props.values.preferences.contact_via_sms &&
                      props.values.smsNumber
                    ) {
                      setFieldValue('smsNumber', '');
                    }
                    setFieldValue(
                      'preferences.contact_via_sms',
                      !props.values.preferences?.contact_via_sms
                    );
                  }}
                >
                  <Checkbox isDisabled defaultIsChecked>
                    Email
                  </Checkbox>

                  <Checkbox
                    defaultIsChecked={props.values.preferences?.contact_via_sms}
                  >
                    SMS
                    {props.values.preferences?.contact_via_sms ? (
                      <Field name="smsNumber">
                        {({ field }) => (
                          <FormControl>
                            <InputGroup>
                              <InputLeftAddon children="+" />
                              <Input
                                type="tel"
                                roundedLeft="0"
                                defaultValue={props.initialSmsNumber}
                                placeholder="44XXXXXX"
                                {...field}
                              />
                            </InputGroup>
                          </FormControl>
                        )}
                      </Field>
                    ) : (
                      ''
                    )}
                  </Checkbox>
                </CheckboxGroup>
              </FormControl>
            )}
          </Field>
        </Box>
        <Box>
          <Button
            mt={4}
            variantColor="teal"
            isLoading={isSubmitting}
            type="submit"
          >
            Save
          </Button>
        </Box>
      </Stack>
    </Form>
  );
};

interface SettingsFormProps {
  initialDisplayName?: string;
  initialPreferences?: {};
  initialSmsNumber?: string;
}

interface SettingsFormInnerProps extends SettingsFormProps {
  saveDisplayName: () => void;
  toast: (toast: useToastOptions) => void;
  uid: string;
}

const WithFormik = withFormik<SettingsFormInnerProps, FormValues>({
  // Transform outer props into form values
  mapPropsToValues: (props) => ({
    displayName: props.initialDisplayName || '',
    preferences: props.initialPreferences || {},
    smsNumber: props.initialSmsNumber || ''
  }),

  handleSubmit: async (values, actions) => {
    const { settingsChanged } = useAnalytics();

    //Check if notification preference is set to SMS and contact number is not null
    if (values.preferences.contact_via_sms && !values.smsNumber) {
      actions.props.toast({
        position: 'bottom-right',
        title: 'SMS Number is missing',
        description:
          'You have chosen SMS as preferred notification. However, no sms number was provided',
        status: 'error',
        isClosable: true
      });
      actions.setSubmitting(false);
      return;
    }

    try {
      //  Public Profile
      await firebase.database().ref(`profiles/${actions.props.uid}/`).update({
        displayName: values.displayName
      });

      //  Settings
      await firebase
        .firestore()
        .collection('accounts')
        .doc(actions.props.uid)
        .update({
          smsNumber: values.smsNumber.length > 0 ? values.smsNumber : null,
          'preferences.contact_via_sms': values.smsNumber.length > 0
        });

      actions.props.toast({
        position: 'bottom-right',
        title: 'Saved',
        description: 'Your settings have been updated.',
        status: 'success',
        isClosable: true
      });

      settingsChanged();
      actions.setSubmitting(false);
    } catch (e) {
      actions.props.toast({
        position: 'bottom-right',
        title: "That's annoying",
        description: e.message,
        status: 'error',
        isClosable: true
      });
      actions.setSubmitting(false);
    }
  }
})(InnerForm);

// Wrap our form with the withFormik HoC
const SettingsForm: React.FC<SettingsFormProps> = (props) => {
  const toast = useToast();
  const { profile } = useAuth();

  const [account, setAccount] = React.useState(null);
  React.useEffect(() => {
    if (profile?.uid) {
      firestore
        .collection('accounts')
        .doc(profile?.uid)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            console.log('No such document!');
          } else {
            const data = doc.data();
            setAccount(data);
          }
        });
    }
  }, [profile, setAccount]);

  const [me, loadingMe] = withPerson({
    uid: profile?.uid
  });

  if (!account || loadingMe) {
    return <Spinner />;
  }

  return (
    <>
      <WithFormik
        toast={toast}
        uid={profile?.uid}
        initialDisplayName={me.displayName}
        initialPreferences={account.preferences}
        initialSmsNumber={account.smsNumber}
        {...props}
      />
    </>
  );
};

export default SettingsForm;
