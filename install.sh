#!/bin/bash

# Install some essential packages
# rust nodejs(nvm yarn) git python-pip nvim  zsh(+oh-my-zsh) starship-prompt

pkgs=(
	"git"
	"kitty"
	"neovimz"
	"openssl" # dependency for tealdeer
	"python"
	"yarn"
	"zsh"
)

cargo_pkgs=(
	"stylua"
	"exa"
	"bat"
	"tealdeer"
)

install_core_pkgs() {
	for pkg in "${pkgs[@]}"; do
		if hash "$pkg" 2>/dev/null; then
			echo "$pkg is installed..."
		else
			echo "$pkg is not installed..."
			# Detect the platform
			OS="$(uname)"
			case $OS in
			'Linux')
				if [ -f "/etc/arch-release" ]; then
					echo "arch system found..."
					echo "using pacman to install $pkg"
					sudo pacman -Syu $pkg || echo "$pkg failed to install"
				elif [ -f "/etc/fedora-release" ] || [ -f "/etc/redhat-release" ]; then
					echo "Redhat/Fedora system found..."
					echo "Using dnf to install $pkg"
					sudo dnf install $pkg || echo "$pkg failed to install"
				else
					sudo apt install "$pkg" || echo "$pkg failed to install"
				fi
				;;
			*) ;;
			esac
			echo "Done "
		fi
	done
}

install_cargo_pkgs() {
	echo "Installing packages with cargo..."
	for pkg in "${cargo_pkgs[@]}"; do
		"$(which cargo)" install $pkg
		echo ""
	done
}

# Rust lang install
install_rustup() {
	echo "installing rust via rustup..."
	curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
	echo ""
}

# Starship Prompt install
install_starship() {
	echo "Installing starship prompt..."
	sh -c "$(curl -fsSL https://starship.rs/install.sh)"
	echo ""
}

# Node version manager install
install_nvm() {
	echo "Installing Node Version Manager..."
	curl -o- https://raw.githubusercontent.com/nvm-sh/v0.39.1/install.sh | bash
	echo ""
}

# Install Oh My Zsh
install_omz() {
	echo "Installing oh my zsh..."
	sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
	echo ""
}

#################################################################
##### Dotfiles setup                                        #####
#################################################################

# check git installation and pull dotfiles repo
clone_dotfiles() {
	if [[ -f $(command -v git) ]]; then
		echo 'found git'
		git clone --bare https://github.com/joey364/dotfiles.git $HOME/.dotfiles
	else
		echo 'Install git then re-run the script'
		exit 1
	fi
	echo ""
}

# function to mimick config alias

config() {
	/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME "$@"
}

# Create a backup of existing config

checkout_config() {
	config checkout

	if [ $? = 0 ]; then
		echo "Checked out config..."
	else
		# existing config found
		mkdir -p .config-backup
		echo "Backing up pre-existing dot files."
		config checkout 2>&1 | egrep "\s+\." | awk {'print $1'} | xargs -I{} mv {} .config-backup/{}
	fi

	config checkout
	config config status.showUntrackedFiles no
}

main() {
	echo "you are running the script..."
	echo "sudo access needed"
	sudo -v

	# install_core_pkgs "$@"

	# install_rustup
	# install_cargo_pkgs
	# install_starship

	echo ""
	echo "Have a nice day ;)"
}

main "$@"