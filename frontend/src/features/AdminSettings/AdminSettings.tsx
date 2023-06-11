import {
  Box,
  Button,
  Center,
  Group,
  PasswordInput,
  Progress,
  TextInput,
  Text,
  Card,
  ActionIcon,
  CopyButton,
  Tooltip,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAB2,
  IconAlertTriangle,
  IconCheck,
  IconCopy,
  IconEye,
  IconEyeOff,
  IconX,
} from "@tabler/icons-react";
import { showNotification, updateNotification } from "@mantine/notifications";
import sha256 from "crypto-js/sha256";
import generator from "generate-password-browser";
import { useState } from "react";
import { AdminService } from "../../services";

function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <Text color={meets ? "teal" : "red"} mt={5} size="sm">
      <Center inline>
        {meets ? (
          <IconCheck size={14} stroke={1.5} />
        ) : (
          <IconX size={14} stroke={1.5} />
        )}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

const AdminSettings: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const loggedAdmin = JSON.parse(localStorage.getItem("admin") || "{}");
  const adminSettingsForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      firstName: loggedAdmin.firstName,
      lastName: loggedAdmin.lastName,
      email: loggedAdmin.email,
      phone: loggedAdmin.phone,
      gender: loggedAdmin.gender,
    },
    validate: {
      firstName: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      lastName: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Please enter a valid email address",
      phone: (value) =>
        /^\d{10}$/.test(value) ? null : "Please enter a valid phone number",
    },
  });
  const adminPasswordForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      password: (value) =>
        /[0-9]/.test(value) &&
        /[a-z]/.test(value) &&
        /[A-Z]/.test(value) &&
        /[$&+,:;=?@#|'<>.^*()%!-]/.test(value) &&
        value.length > 7
          ? null
          : "Password must be at least 8 characters long and include at least one number, one lowercase letter, one uppercase letter and one special symbol",
      confirmPassword: (value, { password }) =>
        value === password ? null : "Passwords do not match",
    },
  });
  const strength = getStrength(adminPasswordForm.values.password);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(adminPasswordForm.values.password)}
    />
  ));
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ bar: { transitionDuration: "0ms" } }}
        value={
          adminPasswordForm.values.password.length > 0 && index === 0
            ? 100
            : strength >= ((index + 1) / 4) * 100
            ? 100
            : 0
        }
        color={strength > 80 ? "teal" : strength > 50 ? "yellow" : "red"}
        key={index}
        size={4}
      />
    ));

  const updateAdminInfo = async (values: {
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    phone: string;
  }) => {
    showNotification({
      id: "edit-admin",
      loading: true,
      title: "Saving changes",
      message: "Saving changes in database",
      autoClose: false,
      withCloseButton: false,
    });
    AdminService.updateAdminInfoAdminSettings(values)
      .then((response) => {
        const admin = {
          ...loggedAdmin,
          firstName: response.data.data.firstName,
          lastName: response.data.data.lastName,
          email: response.data.data.email,
          phone: response.data.data.phone,
          gender: response.data.data.gender,
        };
        localStorage.setItem("admin", JSON.stringify(admin));
        window.location.reload();
        updateNotification({
          id: "edit-admin",
          color: "teal",
          title: "Update successful",
          message: "Your data has been updated.",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
      })
      .catch(() => {
        updateNotification({
          id: "edit-admin",
          color: "red",
          title: "Update failed",
          message: "We were unable to update your data.",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  const updateAdminPassword = async (values: {
    currentPassword: string;
    password: string;
    confirmPassword: string;
  }) => {
    showNotification({
      id: "edit-admin-password",
      loading: true,
      title: "Saving changes",
      message: "Saving your new password",
      autoClose: false,
      withCloseButton: false,
    });
    const encryptedCurrentPassword = sha256(values.currentPassword).toString();
    const encryptedPassword = sha256(values.password).toString();
    const adminPassword = {
      currentPassword: encryptedCurrentPassword,
      newPassword: encryptedPassword,
    };
    AdminService.updateAdminPassword(adminPassword)
      .then(() => {
        adminPasswordForm.reset();
        updateNotification({
          id: "edit-admin-password",
          color: "teal",
          title: "Update successful",
          message: "Your password has been updated.",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
      })
      .catch((error) => {
        updateNotification({
          id: "edit-admin-password",
          color: "red",
          title: "Update failed",
          message: error.response.data.message,
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  const generatePassword = () => {
    const password = generator.generate({
      length: 12,
      numbers: true,
      uppercase: true,
      lowercase: true,
      symbols: true,
    });
    adminPasswordForm.setFieldValue("password", password);
    adminPasswordForm.setFieldValue("confirmPassword", password);
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Card shadow="sm" p="lg" radius="md" withBorder m="xs">
        <form
          onSubmit={adminSettingsForm.onSubmit((values) =>
            updateAdminInfo(values)
          )}
        >
          <TextInput
            label="First Name"
            placeholder="Enter first name"
            {...adminSettingsForm.getInputProps("firstName")}
            required
          />
          <TextInput
            label="Last Name"
            placeholder="Enter last name"
            {...adminSettingsForm.getInputProps("lastName")}
            required
          />
          <TextInput
            label="Email"
            placeholder="Enter email"
            type={"email"}
            {...adminSettingsForm.getInputProps("email")}
            required
          />
          <TextInput
            label="Phone"
            placeholder="Enter phone"
            {...adminSettingsForm.getInputProps("phone")}
            required
          />
          <Select
            label="Gender"
            placeholder="Select gender"
            {...adminSettingsForm.getInputProps("gender")}
            required
            data={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            defaultValue={adminSettingsForm.values.gender}
          />
          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Save Info
          </Button>
        </form>
      </Card>
      <Card shadow="sm" p="lg" radius="md" withBorder m="xs">
        <form
          onSubmit={adminPasswordForm.onSubmit((values) =>
            updateAdminPassword(values)
          )}
        >
          <PasswordInput
            placeholder="Your current password"
            label="Current Password"
            {...adminPasswordForm.getInputProps("currentPassword")}
          />
          <TextInput
            placeholder="Your New password"
            type={passwordVisible ? "text" : "password"}
            label="New Password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$&+,:;=?@#|'<>.^*()%!-]).{8,}"
            {...adminPasswordForm.getInputProps("password")}
            rightSection={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CopyButton
                  value={adminPasswordForm.values.password}
                  timeout={2000}
                >
                  {({ copied, copy }) => (
                    <Tooltip
                      label={copied ? "Copied" : "Copy"}
                      withArrow
                      position="right"
                    >
                      <ActionIcon
                        color={copied ? "teal" : "gray"}
                        onClick={copy}
                      >
                        {copied ? (
                          <IconCheck size="2rem" />
                        ) : (
                          <IconCopy size="2rem" />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
                <Tooltip label="Generate password" withArrow position="right">
                  <ActionIcon
                    variant="transparent"
                    onClick={() => generatePassword()}
                  >
                    <IconAB2 size="2rem" />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="View password" withArrow position="right">
                  <ActionIcon
                    variant="transparent"
                    onClick={() => {
                      if (passwordVisible) {
                        setPasswordVisible(false);
                      } else {
                        setPasswordVisible(true);
                      }
                    }}
                    mr="50px"
                  >
                    {passwordVisible ? (
                      <IconEyeOff size="2rem" />
                    ) : (
                      <IconEye size="2rem" />
                    )}
                  </ActionIcon>
                </Tooltip>
              </Box>
            }
          />
          <PasswordInput
            placeholder="Confirm your password"
            label="Confirm Password"
            {...adminPasswordForm.getInputProps("confirmPassword")}
          />
          <Group spacing={5} grow mt="xs" mb="md">
            {bars}
          </Group>
          <PasswordRequirement
            label="Has at least 8 characters"
            meets={adminPasswordForm.values.password.length > 7}
          />
          {checks}
          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Change Password
          </Button>
        </form>
      </Card>
    </Box>
  );
};

export default AdminSettings;
