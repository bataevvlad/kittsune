import { CommanderStatic } from 'commander';
import BootstrapService from '../services/bootstrap.service';

const BOOTSTRAP_COMMAND_DESCRIPTION = `
Compile mapping.json into style object, optionally merging it with another mapping
https://github.com/bataevvlad/kitsune#readme
`;

const BOOTSTRAP_COMMAND_USAGE = `

- To compile the only Eva package:
kitsune bootstrap @kitsuine/eva

- To compile Eva package by merging it with another mapping:
kitsune bootstrap @kitsuine/eva ./path-to/mapping.json
`;

// eslint-disable-next-line no-restricted-syntax
export default (program: CommanderStatic): void => {
  program.command('bootstrap <evaPackage> [mappingPath]')
    .description(BOOTSTRAP_COMMAND_DESCRIPTION)
    .usage(BOOTSTRAP_COMMAND_USAGE)
    .action((evaPackage, customMappingPath) => BootstrapService.run({ evaPackage, customMappingPath }));
};
