{
  inputs = {
    pyproject-nix = {
      url = "github:pyproject-nix/pyproject.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    uv2nix = {
      url = "github:pyproject-nix/uv2nix";
      inputs.pyproject-nix.follows = "pyproject-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    pyproject-build-systems = {
      url = "github:pyproject-nix/build-system-pkgs";
      inputs.pyproject-nix.follows = "pyproject-nix";
      inputs.uv2nix.follows = "uv2nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      nixpkgs,
      flake-utils,
      pyproject-nix,
      uv2nix,
      pyproject-build-systems,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
        python = pkgs."<python-nix-attribute>";
        workspace = uv2nix.lib.workspace.loadWorkspace {
          workspaceRoot = ./.;
        };
        overlay = workspace.mkPyprojectOverlay {
          sourcePreference = "wheel";
        };
        pythonSet =
          (pkgs.callPackage pyproject-nix.build.packages {
            inherit python;
          }).overrideScope
            (pkgs.lib.composeManyExtensions [
              pyproject-build-systems.overlays.wheel
              overlay
            ]);
        editableOverlay = workspace.mkEditablePyprojectOverlay {
          root = "$REPO_ROOT";
        };
        editablePythonSet = pythonSet.overrideScope editableOverlay;
        virtualenv = editablePythonSet.mkVirtualEnv
          "python-dev-env" workspace.deps.all;
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [ virtualenv pkgs.uv ];
          UV_NO_SYNC = "1";
          UV_PYTHON = python.interpreter;
          UV_PYTHON_DOWNLOADS = "never";

          shellHook = ''
            unset PYTHONPATH
            export REPO_ROOT=$(git rev-parse --show-toplevel)
          '';
        };
      }
    );
}
