import { useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  Button,
  Menu,
  UnstyledButton,
  Avatar,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import LOGO from "../../assets/logo.png";
import DEFAULTPROFILE from "../../assets/defaultprofile.png";
import { IconChevronDown, IconLogout, IconSettings } from "@tabler/icons-react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

const HEADER_HEIGHT = 60;

interface LinkItem {
  link: string;
  label: string;
}

interface CustomLinkProps {
  to: string;
  item: LinkItem;
  onClick: () => void;
  noHero?: boolean;
}

const links: LinkItem[] = [
  { link: "/user", label: "Home" },
  { link: "/user/iq-test", label: "IQ Test" },
  { link: "/user/job-categories", label: "Job Categories" },
  { link: "/about", label: "About" },
];

const CustomLink: React.FC<CustomLinkProps> = ({
  to,
  item,
  onClick,
  noHero,
}) => {
  const useStyles = createStyles((theme) => ({
    link: {
      display: "block",
      lineHeight: 1,
      padding: "8px 12px",
      borderRadius: theme.radius.sm,
      textDecoration: "none",
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[0]
          : theme.colors.gray[7],
      fontSize: theme.fontSizes.sm,
      fontWeight: 500,

      "&:hover": {
        boxShadow: `0 0 0 1px ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[0]
        }`,
        backgroundColor: noHero ? theme.colors.gray[3] : "transparent",
      },

      [theme.fn.smallerThan("sm")]: {
        borderRadius: 0,
        padding: theme.spacing.md,
      },
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({
          variant: "light",
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  }));
  const { classes, cx } = useStyles();
  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <Link
      className={cx(classes.link, {
        [classes.linkActive]: item.link === match?.pathname,
      })}
      to={item.link}
      key={item.label}
      onClick={onClick}
    >
      <Text color={match?.pathname === item.link || noHero ? "black" : "white"}>
        {item.label}
      </Text>
    </Link>
  );
};

interface UserHeaderMenuProps {
  noHero?: boolean;
}

const UserHeaderMenu: React.FC<UserHeaderMenuProps> = ({ noHero }) => {
  const useStyles = createStyles((theme) => ({
    root: {
      width: "100%",
      position: "relative",
      zIndex: 2500,
      backgroundColor: "transparent",
    },

    dropdown: {
      position: "absolute",
      top: HEADER_HEIGHT,
      left: 0,
      right: 0,
      zIndex: 0,
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0,
      borderTopWidth: 0,
      overflow: "hidden",

      [theme.fn.largerThan("sm")]: {
        display: "none",
      },
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "100%",
      width: "90%",
      maxWidth: 1200,
    },

    links: {
      [theme.fn.smallerThan("sm")]: {
        display: "none",
      },
    },

    burger: {
      [theme.fn.largerThan("sm")]: {
        display: "none",
      },
    },

    hiddenMobile: {
      [theme.fn.smallerThan("sm")]: {
        display: "none",
      },
    },

    user: {
      color: noHero ? "black" : "white",
      padding: "8px 12px",
      borderRadius: theme.radius.sm,
      transition: "background-color 100ms ease",

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
        color: "black",
      },
    },

    userActive: {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
      color: "black",
    },
  }));
  const [opened, { toggle, close }] = useDisclosure(false);
  const { classes, cx } = useStyles();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const items = links.map((link) => (
    <CustomLink
      to={link.link}
      item={link}
      key={link.label}
      onClick={close}
      noHero={noHero}
    />
  ));

  return (
    <Header
      height={HEADER_HEIGHT}
      className={classes.root}
      withBorder={noHero ? true : false}
    >
      <Container className={classes.header}>
        <img src={LOGO} alt="logo" width="50" height="50" />
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        <Group>
          {(user && user.firstName && (
            <Menu
              width={260}
              position="bottom-end"
              transitionProps={{ transition: "pop-top-right", duration: 100 }}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
            >
              <Menu.Target>
                <UnstyledButton
                  className={cx(classes.user, {
                    [classes.userActive]: userMenuOpened,
                  })}
                >
                  <Group spacing={7}>
                    <Avatar
                      src={DEFAULTPROFILE}
                      alt={user.name}
                      radius="xl"
                      size={20}
                    />
                    <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      {user.firstName + " " + user.lastName}
                    </Text>
                    <IconChevronDown size={12} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Settings</Menu.Label>
                <Link
                  to="/user/settings"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <Menu.Item icon={<IconSettings size={14} stroke={1.5} />}>
                    Account settings
                  </Menu.Item>
                </Link>
                <Link
                  to="/logout"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <Menu.Item icon={<IconLogout size={14} stroke={1.5} />}>
                    Logout
                  </Menu.Item>
                </Link>
              </Menu.Dropdown>
            </Menu>
          )) || (
            <Group className={classes.hiddenMobile}>
              <Link to="/login">
                <Button variant="default">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </Group>
          )}
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />
        </Group>
        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
              {!(user && user.firstName) && (
                <Group position="center" grow pb="xl" px="md">
                  <Link to="/login">
                    <Button variant="default">Log in</Button>
                  </Link>
                  <Link to="/signup">
                    <Button>Sign up</Button>
                  </Link>
                </Group>
              )}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
};

export default UserHeaderMenu;
