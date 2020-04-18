import React from "react";
import { Input } from "reactstrap";

import Container from "components/Container";

const Header = () => {
  function handleChange(onSelect) {}

  return (
    <header>
      <Container type="content">
        <p>(COVID-19) Tracker</p>
        <Input type="select" name="select" id="country-name">
          <option>select country</option>
          <option>India</option>
          <option>Australia</option>
        </Input>
      </Container>
    </header>
  );
};

export default Header;
