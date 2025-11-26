import { AppShell, Stack, Tooltip, UnstyledButton } from "@mantine/core";
import { NavbarData, NavbarLinkProps, NavbarProps } from "./NavbarTypes";
import classes from "./navbar.module.css"
import * as motion from "motion/react-client"

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
        <UnstyledButton className={classes.link} data-active={active || undefined}>
          <Icon size={20} stroke={1.5} />
        </UnstyledButton>
      </Tooltip>
    </motion.div>
  );
}

const Navbar: React.FC<NavbarProps> = ({ selectedPage, setSelectedPage }) => {
  const topLinks = NavbarData.slice(0, -1).map((link) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={link.page === selectedPage}
      onClick={() => setSelectedPage(link.page)}
    />
  ));

  const bottomLinkData = NavbarData[NavbarData.length - 1];
  const bottomLink = (
    <NavbarLink
      {...bottomLinkData}
      key={bottomLinkData.label}
      active={bottomLinkData.page === selectedPage}
      onClick={() => setSelectedPage(bottomLinkData.page)}
    />
  );

  return (
    <AppShell.Navbar p="md">
      <Stack justify="space-between" style={{ height: "100%" }}>
        <Stack gap={2}>
          {topLinks}
        </Stack>

        <Stack gap={2}>
          {bottomLink}
        </Stack>
      </Stack>
    </AppShell.Navbar>
  );
};

export default Navbar;
