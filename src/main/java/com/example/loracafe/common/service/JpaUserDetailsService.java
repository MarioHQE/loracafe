package com.example.loracafe.common.service;

import com.example.loracafe.common.entity.Usuario;
import com.example.loracafe.common.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
public class JpaUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Este método es llamado por Spring Security durante el proceso de autenticación.
     * Busca un usuario en la base de datos por su email (que usaremos como 'username').
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Buscamos el usuario por su email
        Usuario usuario = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con el email: " + username));
        
        // Creamos una colección de "autoridades" (roles) para el usuario.
        // Spring Security requiere que los roles tengan el prefijo "ROLE_".
        Collection<? extends GrantedAuthority> authorities = 
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name()));

        // Devolvemos un objeto User de Spring Security con los detalles del usuario.
        return new User(usuario.getEmail(), usuario.getPassword(), authorities);
    }
}