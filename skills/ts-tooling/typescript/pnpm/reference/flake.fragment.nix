(pkgs.runCommand "corepack-enable" { } ''
  mkdir -p $out/bin
  ${pkgs.nodejs}/bin/corepack enable --install-directory $out/bin
'')
