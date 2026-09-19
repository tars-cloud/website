{
  pkgs,
  lib,
  config,
  inputs,
  ...
}:

{
  packages = [
    pkgs.zola
    pkgs.tailwindcss_4
    pkgs.pagefind
    pkgs.convco
    pkgs.git
    pkgs.curl
    pkgs.jq
  ];

  scripts.build.exec = "zola build && pagefind --site public";
  scripts.check.exec = "zola check";
  scripts.serve.exec = "zola serve --drafts";

  enterShell = ''
    echo "TARS Cloud Development Environment"
    echo "Available commands: build, check, serve, devenv test"
    zola --version
    pagefind --version
    convco --version
  '';

  enterTest = ''
    zola check
    zola build
  '';
}
