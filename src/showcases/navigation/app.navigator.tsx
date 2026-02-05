import React from 'react';
import { ScrollView, StyleSheet, ImageProps } from 'react-native';
import {
  Layout,
  Text,
  Button,
  Icon,
  Input,
  Toggle,
  CheckBox,
  Radio,
  Card,
  Divider,
  Spinner,
} from '@kitsuine/components';

const HeartIcon = (props?: Partial<ImageProps>): React.ReactElement => (
  <Icon {...props} name="heart" />
);

const StarIcon = (props?: Partial<ImageProps>): React.ReactElement => (
  <Icon {...props} name="star" />
);

export const AppNavigator = (): React.ReactElement => {
  const [inputValue, setInputValue] = React.useState('');
  const [toggleChecked, setToggleChecked] = React.useState(false);
  const [checkboxChecked, setCheckboxChecked] = React.useState(false);
  const [radioChecked, setRadioChecked] = React.useState(false);

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text category="h1" style={styles.title}>
          Kitsune Components
        </Text>

        {/* Buttons */}
        <Text category="h6" style={styles.sectionTitle}>Buttons</Text>
        <Layout style={styles.row}>
          <Button style={styles.button} status="primary">PRIMARY</Button>
          <Button style={styles.button} status="success">SUCCESS</Button>
          <Button style={styles.button} status="danger">DANGER</Button>
        </Layout>
        <Layout style={styles.row}>
          <Button style={styles.button} appearance="outline">OUTLINE</Button>
          <Button style={styles.button} appearance="ghost">GHOST</Button>
          <Button style={styles.button} accessoryLeft={HeartIcon}>WITH ICON</Button>
        </Layout>

        <Divider style={styles.divider} />

        {/* Input */}
        <Text category="h6" style={styles.sectionTitle}>Input</Text>
        <Input
          style={styles.input}
          placeholder="Type something..."
          value={inputValue}
          onChangeText={setInputValue}
        />
        <Input
          style={styles.input}
          placeholder="With icon"
          accessoryLeft={StarIcon}
        />

        <Divider style={styles.divider} />

        {/* Toggle & Checkbox */}
        <Text category="h6" style={styles.sectionTitle}>Toggle & Checkbox</Text>
        <Toggle
          style={styles.toggle}
          checked={toggleChecked}
          onChange={setToggleChecked}
        >
          Toggle me
        </Toggle>
        <CheckBox
          style={styles.checkbox}
          checked={checkboxChecked}
          onChange={setCheckboxChecked}
        >
          Check me
        </CheckBox>
        <Radio
          style={styles.radio}
          checked={radioChecked}
          onChange={setRadioChecked}
        >
          Select me
        </Radio>

        <Divider style={styles.divider} />

        {/* Card */}
        <Text category="h6" style={styles.sectionTitle}>Card</Text>
        <Card style={styles.card}>
          <Text category="h6">Card Title</Text>
          <Text category="p1">
            This is a card component. You can put any content here.
          </Text>
        </Card>

        <Divider style={styles.divider} />

        {/* Spinner */}
        <Text category="h6" style={styles.sectionTitle}>Spinner</Text>
        <Layout style={styles.row}>
          <Spinner size="small" />
          <Spinner size="medium" />
          <Spinner size="large" />
        </Layout>

      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
  },
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
  input: {
    marginVertical: 8,
  },
  toggle: {
    marginVertical: 8,
  },
  checkbox: {
    marginVertical: 8,
  },
  radio: {
    marginVertical: 8,
  },
  card: {
    marginVertical: 8,
  },
  divider: {
    marginVertical: 16,
  },
});
