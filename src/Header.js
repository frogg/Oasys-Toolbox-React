import React, { Component } from 'react';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';

import logo from './assets/images/brand/oasys_logo_big.png'
import logoSmall from './assets/images/brand/oasys_logo_small.png'

//import IconExplore from '@material-ui/icons/Explore';
//import IconCreate from '@material-ui/icons/Create';
//import IconInsertChart from '@material-ui/icons/InsertChart';
//import IconFormatQuote from '@material-ui/icons/FormatQuote';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class Header extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, height: 40, alt: 'Oasys Logo' }}
          minimized={{ src: logoSmall, width: 36, height: 40, alt: 'Oasys Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink href="#">
              Explore
            </NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#">
              Create
            </NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#">
              Analytics
            </NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#">
              Blog
            </NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          {/*
            <NavItem className="d-md-down-none">
              <NavLink href="#"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
            </NavItem>
            <NavItem className="d-md-down-none">
              <NavLink href="#"><i className="icon-list"></i></NavLink>
            </NavItem>
            <NavItem className="d-md-down-none">
              <NavLink href="#"><i className="icon-location-pin"></i></NavLink>
            </NavItem>
          */}
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              Avatar
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
              <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
              <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
              <DropdownItem divider />
              <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem>
              <DropdownItem><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        {/*<AppAsideToggler className="d-md-down-none" />*/}
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;