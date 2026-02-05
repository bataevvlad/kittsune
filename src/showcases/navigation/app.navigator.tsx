import React from 'react';
import { ScrollView, StyleSheet, ImageProps, View } from 'react-native';
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
  Avatar,
} from '@kitsuine/components';

const HeartIcon = (props?: Partial<ImageProps>): React.ReactElement => (
  <Icon {...props} name="heart" />
);

const StarIcon = (props?: Partial<ImageProps>): React.ReactElement => (
  <Icon {...props} name="star" />
);

const PersonIcon = (props?: Partial<ImageProps>): React.ReactElement => (
  <Icon {...props} name="person" />
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <>
    <Text category="h5" style={styles.sectionTitle}>{title}</Text>
    {children}
    <Divider style={styles.divider} />
  </>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <>
    <Text category="s1" style={styles.subSectionTitle}>{title}</Text>
    {children}
  </>
);

export const AppNavigator = (): React.ReactElement => {
  const [inputValue, setInputValue] = React.useState('');
  const [toggleChecked, setToggleChecked] = React.useState(false);
  const [checkboxChecked, setCheckboxChecked] = React.useState(false);
  const [checkboxIndeterminate, setCheckboxIndeterminate] = React.useState(true);
  const [radioChecked, setRadioChecked] = React.useState(false);

  // Status toggles state
  const [togglePrimary, setTogglePrimary] = React.useState(true);
  const [toggleSuccess, setToggleSuccess] = React.useState(true);
  const [toggleInfo, setToggleInfo] = React.useState(true);
  const [toggleWarning, setToggleWarning] = React.useState(true);
  const [toggleDanger, setToggleDanger] = React.useState(true);
  const [toggleBasic, setToggleBasic] = React.useState(true);

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text category="h1" style={styles.title}>
          Kitsune Components
        </Text>
        <Text category="p1" style={styles.subtitle}>
          Comprehensive Component Showcase
        </Text>

        {/* ==================== TEXT ==================== */}
        <Section title="Text">
          <SubSection title="Categories">
            <Text category="h1">Heading 1</Text>
            <Text category="h2">Heading 2</Text>
            <Text category="h3">Heading 3</Text>
            <Text category="h4">Heading 4</Text>
            <Text category="h5">Heading 5</Text>
            <Text category="h6">Heading 6</Text>
            <Text category="s1">Subtitle 1</Text>
            <Text category="s2">Subtitle 2</Text>
            <Text category="p1">Paragraph 1</Text>
            <Text category="p2">Paragraph 2</Text>
            <Text category="c1">Caption 1</Text>
            <Text category="c2">Caption 2</Text>
            <Text category="label">Label</Text>
          </SubSection>

          <SubSection title="Statuses">
            <Layout style={styles.row}>
              <Text status="primary">Primary</Text>
              <Text status="success">Success</Text>
              <Text status="info">Info</Text>
              <Text status="warning">Warning</Text>
              <Text status="danger">Danger</Text>
              <Text status="basic">Basic</Text>
            </Layout>
          </SubSection>
        </Section>

        {/* ==================== LAYOUT ==================== */}
        <Section title="Layout">
          <SubSection title="Levels">
            <Layout level="1" style={styles.layoutBox}>
              <Text>Level 1</Text>
            </Layout>
            <Layout level="2" style={styles.layoutBox}>
              <Text>Level 2</Text>
            </Layout>
            <Layout level="3" style={styles.layoutBox}>
              <Text>Level 3</Text>
            </Layout>
            <Layout level="4" style={styles.layoutBox}>
              <Text>Level 4</Text>
            </Layout>
          </SubSection>
        </Section>

        {/* ==================== BUTTON ==================== */}
        <Section title="Button">
          <SubSection title="Statuses (Filled)">
            <Layout style={styles.row}>
              <Button status="primary">PRIMARY</Button>
              <Button status="success">SUCCESS</Button>
              <Button status="info">INFO</Button>
            </Layout>
            <Layout style={styles.row}>
              <Button status="warning">WARNING</Button>
              <Button status="danger">DANGER</Button>
              <Button status="basic">BASIC</Button>
            </Layout>
          </SubSection>

          <SubSection title="Appearances">
            <Layout style={styles.row}>
              <Button appearance="filled">FILLED</Button>
              <Button appearance="outline">OUTLINE</Button>
              <Button appearance="ghost">GHOST</Button>
            </Layout>
          </SubSection>

          <SubSection title="Sizes">
            <Layout style={styles.row}>
              <Button size="tiny">TINY</Button>
              <Button size="small">SMALL</Button>
              <Button size="medium">MEDIUM</Button>
            </Layout>
            <Layout style={styles.row}>
              <Button size="large">LARGE</Button>
              <Button size="giant">GIANT</Button>
            </Layout>
          </SubSection>

          <SubSection title="With Icons">
            <Layout style={styles.row}>
              <Button accessoryLeft={HeartIcon}>LEFT ICON</Button>
              <Button accessoryRight={StarIcon}>RIGHT ICON</Button>
            </Layout>
            <Layout style={styles.row}>
              <Button accessoryLeft={HeartIcon} accessoryRight={StarIcon}>BOTH</Button>
            </Layout>
          </SubSection>

          <SubSection title="States">
            <Layout style={styles.row}>
              <Button>ENABLED</Button>
              <Button disabled>DISABLED</Button>
            </Layout>
          </SubSection>

          <SubSection title="Outline Statuses">
            <Layout style={styles.row}>
              <Button appearance="outline" status="primary">PRIMARY</Button>
              <Button appearance="outline" status="success">SUCCESS</Button>
              <Button appearance="outline" status="danger">DANGER</Button>
            </Layout>
          </SubSection>

          <SubSection title="Ghost Statuses">
            <Layout style={styles.row}>
              <Button appearance="ghost" status="primary">PRIMARY</Button>
              <Button appearance="ghost" status="success">SUCCESS</Button>
              <Button appearance="ghost" status="danger">DANGER</Button>
            </Layout>
          </SubSection>
        </Section>

        {/* ==================== INPUT ==================== */}
        <Section title="Input">
          <SubSection title="Basic">
            <Input
              style={styles.input}
              placeholder="Type something..."
              value={inputValue}
              onChangeText={setInputValue}
            />
          </SubSection>

          <SubSection title="With Label & Caption">
            <Input
              style={styles.input}
              label="Email"
              placeholder="Enter your email"
              caption="We'll never share your email"
            />
          </SubSection>

          <SubSection title="With Icons">
            <Input
              style={styles.input}
              placeholder="With left icon"
              accessoryLeft={PersonIcon}
            />
            <Input
              style={styles.input}
              placeholder="With right icon"
              accessoryRight={StarIcon}
            />
            <Input
              style={styles.input}
              placeholder="With both icons"
              accessoryLeft={PersonIcon}
              accessoryRight={HeartIcon}
            />
          </SubSection>

          <SubSection title="Statuses">
            <Input style={styles.input} status="primary" placeholder="Primary" />
            <Input style={styles.input} status="success" placeholder="Success" />
            <Input style={styles.input} status="info" placeholder="Info" />
            <Input style={styles.input} status="warning" placeholder="Warning" />
            <Input style={styles.input} status="danger" placeholder="Danger" />
            <Input style={styles.input} status="basic" placeholder="Basic" />
          </SubSection>

          <SubSection title="Sizes">
            <Input style={styles.input} size="small" placeholder="Small" />
            <Input style={styles.input} size="medium" placeholder="Medium" />
            <Input style={styles.input} size="large" placeholder="Large" />
          </SubSection>

          <SubSection title="States">
            <Input style={styles.input} placeholder="Enabled" />
            <Input style={styles.input} placeholder="Disabled" disabled />
          </SubSection>
        </Section>

        {/* ==================== CHECKBOX ==================== */}
        <Section title="CheckBox">
          <SubSection title="States">
            <CheckBox
              style={styles.checkbox}
              checked={checkboxChecked}
              onChange={setCheckboxChecked}
            >
              {checkboxChecked ? 'Checked' : 'Unchecked'}
            </CheckBox>
            <CheckBox
              style={styles.checkbox}
              checked={true}
            >
              Always Checked
            </CheckBox>
            <CheckBox
              style={styles.checkbox}
              checked={false}
            >
              Always Unchecked
            </CheckBox>
            <CheckBox
              style={styles.checkbox}
              indeterminate={checkboxIndeterminate}
              checked={false}
              onChange={(checked, indeterminate) => {
                setCheckboxIndeterminate(indeterminate);
              }}
            >
              Indeterminate
            </CheckBox>
            <CheckBox
              style={styles.checkbox}
              disabled
            >
              Disabled Unchecked
            </CheckBox>
            <CheckBox
              style={styles.checkbox}
              checked={true}
              disabled
            >
              Disabled Checked
            </CheckBox>
          </SubSection>

          <SubSection title="Statuses">
            <CheckBox style={styles.checkbox} checked status="primary">Primary</CheckBox>
            <CheckBox style={styles.checkbox} checked status="success">Success</CheckBox>
            <CheckBox style={styles.checkbox} checked status="info">Info</CheckBox>
            <CheckBox style={styles.checkbox} checked status="warning">Warning</CheckBox>
            <CheckBox style={styles.checkbox} checked status="danger">Danger</CheckBox>
            <CheckBox style={styles.checkbox} checked status="basic">Basic</CheckBox>
          </SubSection>
        </Section>

        {/* ==================== TOGGLE ==================== */}
        <Section title="Toggle">
          <SubSection title="States">
            <Toggle
              style={styles.toggle}
              checked={toggleChecked}
              onChange={setToggleChecked}
            >
              {toggleChecked ? 'ON' : 'OFF'}
            </Toggle>
            <Toggle style={styles.toggle} checked={true}>Always ON</Toggle>
            <Toggle style={styles.toggle} checked={false}>Always OFF</Toggle>
            <Toggle style={styles.toggle} disabled>Disabled OFF</Toggle>
            <Toggle style={styles.toggle} checked={true} disabled>Disabled ON</Toggle>
          </SubSection>

          <SubSection title="Statuses">
            <Toggle style={styles.toggle} checked={togglePrimary} onChange={setTogglePrimary} status="primary">Primary</Toggle>
            <Toggle style={styles.toggle} checked={toggleSuccess} onChange={setToggleSuccess} status="success">Success</Toggle>
            <Toggle style={styles.toggle} checked={toggleInfo} onChange={setToggleInfo} status="info">Info</Toggle>
            <Toggle style={styles.toggle} checked={toggleWarning} onChange={setToggleWarning} status="warning">Warning</Toggle>
            <Toggle style={styles.toggle} checked={toggleDanger} onChange={setToggleDanger} status="danger">Danger</Toggle>
            <Toggle style={styles.toggle} checked={toggleBasic} onChange={setToggleBasic} status="basic">Basic</Toggle>
          </SubSection>
        </Section>

        {/* ==================== RADIO ==================== */}
        <Section title="Radio">
          <SubSection title="States">
            <Radio
              style={styles.radio}
              checked={radioChecked}
              onChange={setRadioChecked}
            >
              {radioChecked ? 'Selected' : 'Unselected'}
            </Radio>
            <Radio style={styles.radio} checked={true}>Always Selected</Radio>
            <Radio style={styles.radio} checked={false}>Always Unselected</Radio>
            <Radio style={styles.radio} disabled>Disabled Unselected</Radio>
            <Radio style={styles.radio} checked={true} disabled>Disabled Selected</Radio>
          </SubSection>

          <SubSection title="Statuses">
            <Radio style={styles.radio} checked status="primary">Primary</Radio>
            <Radio style={styles.radio} checked status="success">Success</Radio>
            <Radio style={styles.radio} checked status="info">Info</Radio>
            <Radio style={styles.radio} checked status="warning">Warning</Radio>
            <Radio style={styles.radio} checked status="danger">Danger</Radio>
            <Radio style={styles.radio} checked status="basic">Basic</Radio>
          </SubSection>
        </Section>

        {/* ==================== CARD ==================== */}
        <Section title="Card">
          <SubSection title="Basic">
            <Card style={styles.card}>
              <Text category="h6">Card Title</Text>
              <Text category="p1">
                This is a basic card with some content inside.
              </Text>
            </Card>
          </SubSection>

          <SubSection title="With Header & Footer">
            <Card
              style={styles.card}
              header={(props) => (
                <View {...props}>
                  <Text category="h6">Header</Text>
                  <Text category="s1">Subtitle</Text>
                </View>
              )}
              footer={(props) => (
                <View {...props} style={[props?.style, styles.cardFooter]}>
                  <Button size="small" status="basic">CANCEL</Button>
                  <Button size="small">ACCEPT</Button>
                </View>
              )}
            >
              <Text>Card content goes here. This card has both header and footer.</Text>
            </Card>
          </SubSection>

          <SubSection title="Statuses">
            <Card style={styles.card} status="primary">
              <Text>Primary Status</Text>
            </Card>
            <Card style={styles.card} status="success">
              <Text>Success Status</Text>
            </Card>
            <Card style={styles.card} status="info">
              <Text>Info Status</Text>
            </Card>
            <Card style={styles.card} status="warning">
              <Text>Warning Status</Text>
            </Card>
            <Card style={styles.card} status="danger">
              <Text>Danger Status</Text>
            </Card>
          </SubSection>

          <SubSection title="Appearances">
            <Card style={styles.card} appearance="filled">
              <Text>Filled Appearance</Text>
            </Card>
            <Card style={styles.card} appearance="outline">
              <Text>Outline Appearance</Text>
            </Card>
          </SubSection>
        </Section>

        {/* ==================== AVATAR ==================== */}
        <Section title="Avatar">
          <SubSection title="Sizes">
            <Layout style={styles.row}>
              <Avatar
                size="tiny"
                source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
              />
              <Avatar
                size="small"
                source={{ uri: 'https://i.pravatar.cc/150?img=2' }}
              />
              <Avatar
                size="medium"
                source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
              />
              <Avatar
                size="large"
                source={{ uri: 'https://i.pravatar.cc/150?img=4' }}
              />
              <Avatar
                size="giant"
                source={{ uri: 'https://i.pravatar.cc/150?img=5' }}
              />
            </Layout>
          </SubSection>

          <SubSection title="Shapes">
            <Layout style={styles.row}>
              <Avatar
                size="large"
                shape="round"
                source={{ uri: 'https://i.pravatar.cc/150?img=10' }}
              />
              <Avatar
                size="large"
                shape="rounded"
                source={{ uri: 'https://i.pravatar.cc/150?img=11' }}
              />
              <Avatar
                size="large"
                shape="square"
                source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
              />
            </Layout>
          </SubSection>
        </Section>

        {/* ==================== SPINNER ==================== */}
        <Section title="Spinner">
          <SubSection title="Sizes">
            <Layout style={styles.row}>
              <Spinner size="tiny" />
              <Spinner size="small" />
              <Spinner size="medium" />
              <Spinner size="large" />
              <Spinner size="giant" />
            </Layout>
          </SubSection>

          <SubSection title="Statuses">
            <Layout style={styles.row}>
              <Spinner status="primary" />
              <Spinner status="success" />
              <Spinner status="info" />
              <Spinner status="warning" />
              <Spinner status="danger" />
              <Spinner status="basic" />
            </Layout>
          </SubSection>
        </Section>

        {/* ==================== DIVIDER ==================== */}
        <Section title="Divider">
          <Text category="p1">Content above divider</Text>
          <Divider style={styles.dividerExample} />
          <Text category="p1">Content below divider</Text>
        </Section>

        {/* ==================== ICON ==================== */}
        <Section title="Icon">
          <SubSection title="Various Icons">
            <Layout style={styles.row}>
              <Icon name="heart" style={styles.icon} fill="#FF3D71" />
              <Icon name="star" style={styles.icon} fill="#FFAA00" />
              <Icon name="person" style={styles.icon} fill="#3366FF" />
              <Icon name="settings" style={styles.icon} fill="#8F9BB3" />
              <Icon name="home" style={styles.icon} fill="#00E096" />
            </Layout>
          </SubSection>

          <SubSection title="Sizes">
            <Layout style={styles.row}>
              <Icon name="heart" style={{ width: 16, height: 16 }} fill="#FF3D71" />
              <Icon name="heart" style={{ width: 24, height: 24 }} fill="#FF3D71" />
              <Icon name="heart" style={{ width: 32, height: 32 }} fill="#FF3D71" />
              <Icon name="heart" style={{ width: 48, height: 48 }} fill="#FF3D71" />
            </Layout>
          </SubSection>
        </Section>

        <View style={styles.footer}>
          <Text category="c1" appearance="hint">
            End of Component Showcase
          </Text>
        </View>

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
    paddingBottom: 100,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#3366FF',
    paddingBottom: 8,
  },
  subSectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: '#8F9BB3',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
  },
  layoutBox: {
    padding: 16,
    marginVertical: 4,
    borderRadius: 4,
  },
  input: {
    marginVertical: 4,
  },
  toggle: {
    marginVertical: 4,
  },
  checkbox: {
    marginVertical: 4,
  },
  radio: {
    marginVertical: 4,
  },
  card: {
    marginVertical: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  divider: {
    marginVertical: 24,
  },
  dividerExample: {
    marginVertical: 8,
  },
  icon: {
    width: 32,
    height: 32,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingVertical: 16,
  },
});
