#!/bin/bash

# Install some essential packages
# rust nodejs(nvm yarn) git python-pip nvim  zsh(+oh-my-zsh) starship-prompt

pkgs=(
	"git"
	"kitty"
	"neovim"
	"openssl" # dependency for tealdeer
	"python"
	"zsh"
)

cargo_pkgs=(
	"stylua"
	"exa"
	"bat"
	"tealdeer"
)

install_core_pkgs() {
	echo "Installing core pkgs..."
	echo ""

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
		if command -v cargo &>/dev/null; then
			cargo install $pkg
		fi
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

# Yarn package manager
install_yarn() {
	echo "Installing yarn.."
	# arch
	if [ -f "/etc/arch-release" ]; then
		echo "installing yarn with pacman.."
		pacman -Sy yarn
	elif [ -f "/etc/fedora-release" ]; then
		# fedora / rhel
		echo "installing yarn with dnf.."
		curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
		sudo dnf -y install yarn
	else
		# debian/ubuntu
		echo "installing yarn with apt.."
		curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
		echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
		sudo apt update && sudo apt install yarn -y
	fi

}

# Install Oh My Zsh
install_omz() {
	echo "Installing oh my zsh..."
	sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
	echo ""
}

_zsh_autosuggestions() {
	echo "Zsh autosuggestions"
	git clone https://github.com/zsh-users/zsh-autosuggestions \
		${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
	echo
}

_zsh_syntax_highlighting() {
	echo "Zsh syntax highlighting"
	git clone https://github.com/zsh-users/zsh-syntax-highlighting.git \
		${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
	echo
}

_zsh_autojump() {
	echo "Install Autojump plugin"
	autojump_install_dir=${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/autojump
	git clone https://github.com//wting/autojump.git $autojump_install_dir
	cd $autojump_install_dir && ./install.py
	echo
}

install_zsh_plugins() {
	echo "installing zsh plugins.."
	_zsh_syntax_highlighting
	_zsh_autosuggestions
	_zsh_autojump
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
	echo
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

print_banner() {
	cat <<'EOF'
     _       _    __ _ _                      _               
  __| | ___ | |_ / _(_) | ___  ___   ___  ___| |_ _   _ _ __  
 / _` |/ _ \| __| |_| | |/ _ \/ __| / __|/ _ \ __| | | | '_ \ 
| (_| | (_) | |_|  _| | |  __/\__ \ \__ \  __/ |_| |_| | |_) |
 \__,_|\___/ \__|_| |_|_|\___||___/ |___/\___|\__|\__,_| .__/ 
                                                       |_|    
EOF
}

main() {

	print_banner

	echo "you are running the script..."
	echo "sudo access needed"
	sudo -v

	install_core_pkgs "$@"

	echo "Changing shell to zsh.."
	chsh -s "$(which zsh)"

	install_omz

	install_zsh_plugins

	install_rustup

	# install_cargo_pkgs

	install_starship

	install_nvm

	clone_dotfiles

	checkout_config

	echo "Have a nice day 😃"
}

main "$@"
